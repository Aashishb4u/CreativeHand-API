const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const {toJSON, paginate} = require('./plugins');
const {roles} = require('../config/roles');

const websiteEnquirySchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
    },
    contactNumber: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    }
  },
    {
        timestamps: true,
    });


// add plugin that converts mongoose to json
websiteEnquirySchema.plugin(toJSON);
websiteEnquirySchema.plugin(paginate);

// add plugin that converts mongoose to json

const WebsiteEnquiry = mongoose.model('WebsiteEnquiry', websiteEnquirySchema);

module.exports = WebsiteEnquiry;
