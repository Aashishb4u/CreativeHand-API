const Joi = require('joi');
const { password, objectId } = require('../custom.validation');

const register = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        contactNumber: Joi.string().required(),
        name: Joi.string().required(),
        role: Joi.custom(objectId),
    }),
};



module.exports = {
    register
};
