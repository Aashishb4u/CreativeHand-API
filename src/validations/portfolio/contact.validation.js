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


const linkedin_email = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
    }),
};

const linkedin_followers = {
    body: Joi.object().keys({
        count: Joi.number().required(),
        linkedInContactData: Joi.array().items(Joi.object().keys({
            acceptButtonText: Joi.string().optional().allow(''),
            acceptLabel: Joi.string().optional().allow(''),
            avatar: Joi.string().required(),
            caption: Joi.string().required(),
            degree: Joi.string().required(),
            headline: Joi.string().required(),
            mutualConnections: Joi.string().required().allow(''),
            name: Joi.string().required(),
            profileUrl: Joi.string().required(),
        })).required(),
    }),
};



module.exports = {
    email,
    linkedin_email,
    linkedin_followers
};
