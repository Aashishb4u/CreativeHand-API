const bcrypt = require('bcryptjs');
const {toJSON, paginate} = require('./plugins');
const {roles} = require('../config/roles');
const mongoose = require('mongoose');

const offerSchema = mongoose.Schema(
  {
    name: String,
    days: Number
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
offerSchema.plugin(toJSON);
offerSchema.plugin(paginate);

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
