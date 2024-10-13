const Joi = require('joi');
const { password, objectId } = require('../custom.validation');
// const { query } = require('express');

const register = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        contactNumber: Joi.string().required(),
        name: Joi.string().required(),
        role: Joi.custom(objectId),
    }),
};


const linkedInPost = {
    body: Joi.object().keys({
        postId: Joi.string().required(),
    }),
};

const fetchLinkedInPost = {
    params: Joi.object().keys({
        postId: Joi.string().required(),
    })
};



module.exports = {
    register,
    linkedInPost,
    fetchLinkedInPost
};
