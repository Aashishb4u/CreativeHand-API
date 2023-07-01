const httpStatus = require('http-status');
const { Business, Payment, User } = require('../models');
const { Offer, WebsiteEnquiry, BusinessView } = require('../models');
const ApiError = require('../utils/ApiError');
const _ = require("lodash");
/**
 * Create a business
 * @param {Object} businessBody
 * @returns {Promise<Business>}
 */
const createBusiness = async (businessBody) => {
  const businessDetails = await getBusinessByKeyword(businessBody.keywordUrl);
  if(businessDetails) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Keyword is taken.');
  }
  return Business.create(businessBody);
};

/**
 * Query for businesses
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWebsiteEnquiries = async (filter, options) => {
  let enquiries = await WebsiteEnquiry.paginate(filter, options);
  return enquiries;
};

const queryBusinesses = async (filter, options) => {
  let businesses = await Business.paginate(filter, options);
  businesses.results = await Promise.all(businesses.results.map(async (business) => {
    const payments = await Payment.find({ businessId: business._id }).exec();
    const customerDetails = business.customerId ? await User.findOne({ _id: business.customerId }).exec() : null;
    const executiveDetails = business.executiveId ? await User.findOne({ _id: business.executiveId }).exec() : null;
    const offerDetails = business.offerId ? await Offer.findOne({ _id: business.offerId }).exec() : null;
    return {
      ...business._doc,
      payments: payments ? payments : null,
      customerDetails,
      executiveDetails,
      offerDetails
    };
  }));

  return businesses;
};




/**
 * Get business by id
 * @param {ObjectId} id
 * @returns {Promise<Business>}
 */
const getBusinessById = async (id) => {
  return Business.findById(id);
};

const getBusinessByKeyword = async (keyword) => {
  return Business.findOne({ keywordUrl: keyword });
};

const getBusinessByLanguage = async (lang) => {
  return Business.findOne({ language: lang });
};

const getBusinessProductsById = async (id) => {
  return Business.findOne({ _id: id }, { products: 1 })
    .select('-_id products')
    .lean()
    .exec();
};

const getBusinessPortfolioById = async (id) => {
  return Business.findOne({ _id: id }, { portfolioImages: 1 })
    .select('-_id portfolioImages')
    .lean()
    .exec();
};

/**
 * Update business by id
 * @param {ObjectId} businessId
 * @param {Object} updateBody
 * @returns {Promise<Business>}
 */
const updateBusinessById = async (businessId, updateBody) => {
  let business = await getBusinessById(businessId);
  console.log(updateBody);
  if (!business) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business not found');
  }

  if(updateBody.business) {
    Object.assign(business.business, updateBody.business);
  }

  if(updateBody.address) {
    Object.assign(business.address, updateBody.address);
  }

  if(updateBody.socialMediaLinks) {
    Object.assign(business.socialMediaLinks, updateBody.socialMediaLinks);
  }

  if(updateBody.bankDetails) {
    Object.assign(business.bankDetails, updateBody.bankDetails);
  }

  if(updateBody.upiPayments) {
    Object.assign(business.upiPayments, updateBody.upiPayments);
  }

  if(updateBody.videoLinks) {
    business.videoLinks = updateBody.videoLinks;
  }

  if(updateBody.portfolioImages) {
    business.portfolioImages = updateBody.portfolioImages;
  }

  if(updateBody.products) {
    business.products = updateBody.products;
    business.products.productName = updateBody.products.productName;
    business.products.productDescription = updateBody.products.productDescription;
  }

  if(updateBody.specialities) {
    business.specialities = updateBody.specialities;
  }

  business.whatsappCatalogue = updateBody.whatsappCatalogue ? updateBody.whatsappCatalogue : '';

  if(updateBody.theme) {
    business.theme = updateBody.theme;
  }

  if(updateBody.template) {
    business.template = updateBody.template;
  }

  if(updateBody.keywordUrl) {
    business.keywordUrl = updateBody.keywordUrl;
  }

  if(updateBody.status) {
    business.status = updateBody.status;
  }

  if(updateBody.language) {
    business.language = updateBody.language;
  }

  if(updateBody.isDemo) {
    business.isDemo = updateBody.isDemo;
  }

  if(updateBody.PaymentStatus) {
    business.PaymentStatus = updateBody.PaymentStatus;
  }

  if(updateBody.currentPaymentId) {
    business.currentPaymentId = updateBody.currentPaymentId;
  }

  if(updateBody.paymentStatus) {
    business.paymentStatus = updateBody.paymentStatus;
  }

  if(updateBody.subscriptionEndDate) {
    business.subscriptionEndDate = updateBody.subscriptionEndDate;
  }

  if(updateBody.subscriptionStartDate) {
    business.subscriptionStartDate = updateBody.subscriptionStartDate;
  }

  await business.save();
  return business;
};

const renderDemoBusiness = async (updateBody) => {
  let language = updateBody.language;
  let business = await getBusinessByLanguage(language);
  if (business.language && business.isDemo) {
    business.theme = updateBody.theme;
    business.template = updateBody.template;
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business not found');
  }
  await business.save();
  return business;
};

const updateBusinessProductsById = async (businessId, updateBody) => {
  let business = await getBusinessById(businessId);
  if (!business) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business not found');
  }
  business.products = updateBody.products
  await business.save();
  return business;
};

const updateBusinessImageById = async (businessId, updateBody) => {
  let business = await getBusinessById(businessId);
  if (!business) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business not found');
  }
  business.business.businessImageUrl = updateBody.business.businessImageUrl;
  await business.save();
  return business;
};

const updateBusinessPortfolioById = async (businessId, updateBody) => {
  let business = await getBusinessById(businessId);
  if (!business) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business not found');
  }
  business.portfolioImages = updateBody.portfolioImages;
  await business.save();
  return business;
};

/**
 * Delete business by id
 * @param {ObjectId} businessId
 * @returns {Promise<Business>}
 */
const deleteBusinessById = async (businessId) => {
  const business = await getBusinessById(businessId);
  if (!business) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business not found');
  }
  await business.remove();
  return business;
};


// Business Offers

const createOffer = async (body) => {
  return Offer.create(body);
};

const getOffers = async () => {
  return Offer.find();
};

const contactUs = async (body) => {
  return WebsiteEnquiry.create(body);
};

const addView = async (businessId ,body) => {
  const data = {
    businessId: businessId,
    pageName: body.pageName
  };
  return BusinessView.create(data);
};


const getViews = async (businessId) => {
  return views = BusinessView.find({businessId: businessId});
};


module.exports = {
  createBusiness,
  queryBusinesses,
  getBusinessById,
  updateBusinessById,
  deleteBusinessById,
  updateBusinessProductsById,
  getBusinessProductsById,
  updateBusinessPortfolioById,
  getBusinessPortfolioById,
  updateBusinessImageById,
  getBusinessByKeyword,
  createOffer,
  getOffers,
  renderDemoBusiness,
  getBusinessByLanguage,
  contactUs,
  addView,
  getViews,
  queryWebsiteEnquiries
};
