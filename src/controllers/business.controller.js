const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { businessService, userService } = require('../services');
const {Payment} = require('../models');
const { picUpload, multipleFileUpload } = require('../utils/fileUpload');
const { handleSuccess, handleError, handleSuccessImage } = require('../utils/SuccessHandler');
const templateService = require('../utils/viewTemplates');
const path = require('path');
const nodeHtmlToImage = require('node-html-to-image');
const fetch = require('node-fetch');

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
  const filter = pick(req.query, ['executiveId', 'customerId', 'status']);
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

const contactUs = catchAsync(async (req, res) => {
  const business = await businessService.contactUs(req.body);
  res.status(httpStatus.CREATED).send(business);
});

const downloadImage = catchAsync(async (req, res) => {
  const imageUrl = req.body.imageUrl;
  const response = await fetch(imageUrl);

  // Set the appropriate headers for downloading the image
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', 'attachment; filename=image.png');

  // Convert the response body to a buffer
  const imageBuffer = await response.buffer();

  // Send the buffer as the response
  res.send(imageBuffer);
});

const addView = catchAsync(async (req, res) => {
  const pageName = req.body.pageName;
  const business = await businessService.addView(req.params.businessId, pageName);
  res.status(httpStatus.CREATED).send(business);
});

const getViews = catchAsync(async (req, res) => {
  const business = await businessService.getViews(req.params.businessId);
  res.status(httpStatus.CREATED).send(business);
});


const downloadEnquiryImage = catchAsync(async (req, res) => {
  const business = await businessService.getBusinessById(req.params.businessId);
  if (!business) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business not found');
  }
  const userDetails = await userService.getUserById(business.customerId);
  const productDetails = business.products.find(v => v._id.toString() === req.params.productId);
  const result = await templateService.fetchTemplates('enquiry', business, userDetails, productDetails);

  const options = {
    puppeteerArgs: {
      args: ['--no-sandbox'],
      executablePath: '/usr/bin/chromium-browser',
      // other Puppeteer options...
    },
    // other node-html-to-image options...
  };

  nodeHtmlToImage({
      output: result.outputPath,
      html: result.updatedHtmlContent,
      puppeteerArgs: options.puppeteerArgs, // comment this for local (Imaportant)
  }).then(() => {
    const filename = path.basename(result.outputPath, 'result');
    const relativePath = path.join('public', filename);
    res.status(httpStatus.CREATED).send({imagePath: relativePath});
  }).catch((error) => {
    console.log(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not create Image');
  });
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
  renderDemoBusiness,
  contactUs,
  addView,
  getViews,
  downloadEnquiryImage,
  downloadImage
  // updateBusinessProducts
};
