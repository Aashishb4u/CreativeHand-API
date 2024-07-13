const Joi = require('joi');

const email = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        name: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        subject: Joi.string().required(),
        message: Joi.string().required(),
    }),
};



module.exports = {
    email
};
