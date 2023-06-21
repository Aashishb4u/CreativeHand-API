const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createEnquiry = {
  params: Joi.object().keys({
    businessId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required(),
    contactNumber: Joi.string().required(),
    message: Joi.string().required(),
    businessId: Joi.string().custom(objectId),
  }),
};

const getEnquiries = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getEnquiry = {
  params: Joi.object().keys({
    businessId: Joi.string().custom(objectId),
  }),
};

const updateEnquiry = {
  params: Joi.object().keys({
    businessId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      contact: Joi.string(),
      message: Joi.string(),
      name: Joi.string(),
    })
    .min(1),
};

const deleteEnquiry = {
  params: Joi.object().keys({
    businessId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiry,
  deleteEnquiry,
};
