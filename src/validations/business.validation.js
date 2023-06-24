const Joi = require('joi');
const { password, objectId } = require('./custom.validation');


const createBusiness = Joi.object({
  params: Joi.object().keys({
    business: Joi.object(),
    subscriptionStartDate: Joi.any()
  }),
});

const renderDemoBusiness = Joi.object({
  body: Joi.object().keys({
    theme: Joi.string().required(),
    template: Joi.string().required(),
    language: Joi.string().required(),
  })
});

const contactUs = Joi.object({
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string(),
    phoneNumber: Joi.string(),
  })
});

const updateBusiness = Joi.object({
  body: Joi.object().keys({
    business: Joi.object({
      businessImageUrl: Joi.string(),
      businessName: Joi.string().required().min(2),
      businessType: Joi.string().required(),
      estYear: Joi.string(),
      ownerName: Joi.string().required().min(2),
      qualification: Joi.string(),
      contactNumbers: Joi.array().items(Joi.string()).required(),
      email: Joi.string(),
      website: Joi.string(),
      otherLinks: Joi.array().items(Joi.string()),
    }),
    address: Joi.object({
      addressImageUrl: Joi.string(),
      addressMapLink: Joi.string(),
      addressLine: Joi.string(),
    }),
    socialMediaLinks: Joi.object({
      instagram: Joi.string(),
      facebook: Joi.string(),
      linkedin: Joi.string(),
    }),
    specialities: Joi.string(),
    products: Joi.array().items(
      Joi.object({
        productImageUrl: Joi.string(),
        productName: Joi.string(),
        productDescription: Joi.string(),
      })
    ),
    portfolioImages: Joi.array().items(Joi.string()),
    theme: Joi.string(),
    bankDetails: Joi.object({
      bankName: Joi.string(),
      accountName: Joi.string(),
      accountNumber: Joi.string(),
      IFSCCode: Joi.string(),
      accountType: Joi.string(),
    }),
    upiPayments: Joi.array().items(
      Joi.object({
        upiType: Joi.string(),
        upiUserName: Joi.string(),
        upiContact: Joi.string(),
      })
    ),
    videoLinks: Joi.array().items(
      Joi.object({
        videoLink: Joi.string(),
        videoId: Joi.string(),
      })
    ),
  })
});

const getBusiness = {
  params: Joi.object().keys({
    businessId: Joi.custom(objectId),
  }),
};


const updateBusinessProducts = {
  params: Joi.object().keys({
    businessId: Joi.custom(objectId),
  }),
};


const uploadBusinessImage = {
  params: Joi.object().keys({
    businessId: Joi.required().custom(objectId),
  }),
};

const uploadPortfolioImages = {
  params: Joi.object().keys({
    businessId: Joi.required().custom(objectId),
  }),
};

const getBusinessByKeyword = {
  params: Joi.object().keys({
    keywordUrl: Joi.required(),
  }),
};

const uploadProductImage = {
  params: Joi.object().keys({
    businessId: Joi.required().custom(objectId),
  }),
};

// Business Offers

const createOffer = {
  body: Joi.object().keys({
    name: Joi.string(),
    days: Joi.number()
  })
};

const updateOffer = {
  params: Joi.object().keys({
    offerId: Joi.custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    days: Joi.number()
  })
};

const getOffer = {
  params: Joi.object().keys({
    offerId: Joi.custom(objectId),
  }),
};

const getOffers = {
  params: Joi.object().keys({
    offerId: Joi.custom(objectId),
  }),
};

module.exports = {
  createBusiness,
  updateBusiness,
  uploadBusinessImage,
  uploadPortfolioImages,
  uploadProductImage,
  getBusiness,
  updateBusinessProducts,
  getBusinessByKeyword,
  createOffer,
  updateOffer,
  getOffer,
  getOffers,
  renderDemoBusiness,
  contactUs
};
