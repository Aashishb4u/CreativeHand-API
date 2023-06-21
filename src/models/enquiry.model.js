const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const {toJSON, paginate} = require('./plugins');
const {roles} = require('../config/roles');

const enquirySchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
      required: true
    },
    contactNumber: {
      type: String,
      default: '',
      required: true
    },
    email: {
      type: String,
      default: '',
      required: true
    },
    message: {
      type: String,
      default: '',
      required: true
    },
    businessId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Business',
    }
  });

// add plugin that converts mongoose to json
enquirySchema.plugin(toJSON);

const Enquiry = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiry;
