const Joi = require("joi");

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

const updateFollower = {
  params: Joi.object().keys({
    profileId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    emailOutreachStatus: Joi.string().optional().allow(""),
    linkedinOutreachStatus: Joi.string().optional().allow(""),
  }),
};



const linkedin_followers = {
  body: Joi.object().keys({
    count: Joi.number().required(),
    linkedInContactData: Joi.array()
      .items(
        Joi.object().keys({
          acceptButtonText: Joi.string().optional().allow(""),
          acceptLabel: Joi.string().optional().allow(""),
          avatar: Joi.string().optional().allow(""),
          caption: Joi.string().required(),
          degree: Joi.string().optional().allow(""),
          headline: Joi.string().optional().allow(""),
          mutualConnections: Joi.string().allow("").optional(),
          name: Joi.string().required(),
          profileUrl: Joi.string().optional().allow(""),
        })
      )
      .required(),
  }),
};

module.exports = {
  email,
  linkedin_email,
  linkedin_followers,
  updateFollower
};
