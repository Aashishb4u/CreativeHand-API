const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createFeedback = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    contactNumber: Joi.string().required(),
    rating: Joi.any().required(),
    feedback: Joi.string().required(),
    businessId: Joi.string().custom(objectId),
  }),
};

const getFeedbacks = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getFeedback = {
  params: Joi.object().keys({
    businessId: Joi.string().custom(objectId),
  }),
};

const updateFeedback = {
  params: Joi.object().keys({
    feedbackId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      businessId: Joi.required().custom(objectId),
      contact: Joi.string(),
      rating: Joi.string(),
      feedback: Joi.string(),
      name: Joi.string(),
      status: Joi.string(),
    })
    .min(1),
};

const deleteFeedback = {
  params: Joi.object().keys({
    businessId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createFeedback,
  getFeedbacks,
  getFeedback,
  updateFeedback,
  deleteFeedback,
};
