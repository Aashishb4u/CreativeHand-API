const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('executive', 'admin', 'customer'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getRoles = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};


const getCustomers = {
  params: Joi.object().keys({

  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};


const createPhoneBook = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
      .keys({
        name: Joi.string(),
        organisation: Joi.string(),
        qualification: Joi.string(),
        address: Joi.string(),
      })
      .min(1),
};

const getPhoneBookByUserId = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  })
};
const deletePhoneBookByUserId = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  })
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getRoles,
  getCustomers,
  createPhoneBook,
  getPhoneBookByUserId,
  deletePhoneBookByUserId
};
