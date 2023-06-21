const mongoose = require('mongoose');
const {toJSON} = require('./plugins');

const phoneBookSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
      required: true
    },
    organisation: {
      type: String,
      default: '',
      required: true
    },
    qualification: {
      type: String,
      default: '',
      required: true
    },
    address: {
      type: String,
      default: '',
      required: true
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  });

// add plugin that converts mongoose to json
phoneBookSchema.plugin(toJSON);

const PhoneBook = mongoose.model('PhoneBook', phoneBookSchema);

module.exports = PhoneBook;
