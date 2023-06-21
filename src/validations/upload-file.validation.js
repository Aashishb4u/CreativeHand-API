const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const uploadFile = {
  body: Joi.object().keys({
   // fileName: Joi.File()
  }),
};


const uploadMultiFiles = {
  body: Joi.object().keys({
    // fileNames: Joi.String()
  }),
};

module.exports = {
  uploadFile,
  uploadMultiFiles

};
