const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { businessService, userService } = require('../services');
const {Payment} = require('../models');
const { picUpload, multipleFileUpload } = require('../utils/fileUpload');
const { handleSuccess, handleError, handleSuccessImage } = require('../utils/SuccessHandler');

const createBusiness = catchAsync(async (req, res) => {
  const business = await businessService.createBusiness(req.body);
  res.status(httpStatus.CREATED).send(business);
});

const uploadBusinessImage = catchAsync(async (req, res) => {
  picUpload(req, res, (err, data) => {
    if(err) {
      console.log(err);
      handleError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Image is not uploaded', req, res, err);
    }
    if (err || !req.file) {
      handleError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Image is not uploaded', req, res, err);
    } else {
      const filePath = req.file && req.file.filename ? `public/${req.file.filename}` : 'public/no-image.png';
      const updateBody = {
        business: {
          businessImageUrl: filePath
        }
      };
      businessService.updateBusinessImageById(req.params.businessId, updateBody).then((result) => {
        handleSuccessImage(httpStatus.CREATED, { result }, 'Business Image Uploaded Successfully.', req, res);
      });
    }
  });
});

const uploadPortfolioImages = catchAsync(async (req, res) => {
  picUpload(req, res, (err, data) => {
    if (err || !req.file) {
      handleError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Image is not uploaded', req, res, err);
    } else {
      let updateBody = {};
      const filePath = req.file && req.file.filename ? `public/${req.file.filename}` : 'public/no-image.png';
      const extractedNumber = parseInt(filePath.match(/business-\w+-portfolioImages-(\d+)\.\w+/)[1]);
      businessService.getBusinessPortfolioById(req.params.businessId).then((result) => {
        let existingImages = result.portfolioImages;

        if (existingImages && existingImages.length > extractedNumber) {
          existingImages[extractedNumber] = filePath;
        } else {
          existingImages.push(filePath);
        }

        updateBody = {
          portfolioImages: existingImages
        };

        businessService.updateBusinessPortfolioById(req.params.businessId, updateBody).then((result) => {
          handleSuccess(httpStatus.CREATED, { result }, 'Product Images Uploaded Successfully.', req, res);
        });
      });
    }
  });
});

const uploadProductImage = catchAsync(async (req, res) => {
  picUpload(req, res, (err, data) => {
    if (err || !req.file) {
      handleError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Image is not uploaded', req, res, err);
    } else {
      let updateBody = {};
      const filePath = req.file && req.file.filename ? `public/${req.file.filename}` : 'public/no-image.png';
      console.log(filePath);
      const extractedNumber = parseInt(filePath.match(/business-\w+-product-(\d+)\.\w+/)[1]);
      console.log(extractedNumber);
      console.log('extractedNumber');
      businessService.getBusinessById(req.params.businessId).then((result) => {
        let existingProducts = result.products && result.products.length ? result.products : [];
        if (existingProducts && existingProducts.length > extractedNumber) {
          existingProducts[extractedNumber].productImageUrl = filePath;
        } else {
          existingProducts.push({
            productName: '',
            productDescription: '',
            productImageUrl: filePath
          });
        }
        updateBody = {
          products: existingProducts
        };

        businessService.updateBusinessProductsById(req.params.businessId, updateBody).then((result) => {
          handleSuccess(httpStatus.CREATED, { result }, 'Product Images Uploaded Successfully.', req, res);
        });
      });
    }
  });
});

const getBusinessById = catchAsync(async (req, res) => {
  const business = await businessService.getBusinessById(req.params.businessId);
  if (!business) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business not found');
  }
  const userDetails = await userService.getUserById(business.customerId);
  const specialitiesData = business.specialities;
  res.send({...business._doc, specialitiesData, userDetails});
});

const getBusiness = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  let result = await businessService.queryBusinesses(filter, options);
  res.send(result);
});

const getBusinessByKeyword = catchAsync(async (req, res) => {
  const business = await businessService.getBusinessByKeyword(req.params.keywordUrl);
  if (!business) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business not found');
  }
  const userDetails = await userService.getUserById(business.customerId);
  const specialitiesData = business.specialities;
  res.send({...business._doc, specialitiesData, userDetails});
});

const updateBusiness = catchAsync(async (req, res) => {
  const business = await businessService.updateBusinessById(req.params.businessId, req.body);
  res.send(business);
});

const renderDemoBusiness = catchAsync(async (req, res) => {
  const business = await businessService.renderDemoBusiness(req.body);
  res.send(business);
});

const deleteBusiness = catchAsync(async (req, res) => {
  await businessService.deleteBusinessById(req.params.businessId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getOffers = catchAsync(async (req, res) => {
  const result = await businessService.getOffers();
  res.send(result);
});

const createOffer = catchAsync(async (req, res) => {
  const business = await businessService.createOffer(req.body);
  res.status(httpStatus.CREATED).send(business);
});

module.exports = {
  createBusiness,
  uploadBusinessImage,
  uploadPortfolioImages,
  uploadProductImage,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  getBusiness,
  getBusinessByKeyword,
  getOffers,
  createOffer,
  renderDemoBusiness
  // updateBusinessProducts
};
