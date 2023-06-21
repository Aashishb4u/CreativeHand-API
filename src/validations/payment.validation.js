const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createPayment = {
  body: Joi.object().keys({
    paymentType: Joi.string().required(),
    paymentAmount: Joi.string().required(),
    paymentDate: Joi.date().required(),
    businessId: Joi.string().custom(objectId),
    createdBy: Joi.string().custom(objectId),
  }),
};

const getPayments = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPaymentById = {
  params: Joi.object().keys({
    paymentId: Joi.string().custom(objectId),
  }),
};

const updatePayment = {
  params: Joi.object().keys({
    paymentId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      paymentType: Joi.string().required(),
      paymentAmount: Joi.string().required(),
      paymentDate: Joi.date().required(),
      businessId: Joi.string().custom(objectId),
      createdBy: Joi.string().custom(objectId),
    })
    .min(1),
};

const deletePayment = {
  params: Joi.object().keys({
    paymentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
