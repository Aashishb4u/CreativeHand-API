const bcrypt = require('bcryptjs');
const {toJSON, paginate} = require('./plugins');
const {roles} = require('../config/roles');
const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    paymentType: {
      type: String,
    },
    paymentAmount: {
      type: String,
    },
    paymentDate: Date,
    businessId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Business',
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
paymentSchema.plugin(toJSON);
paymentSchema.plugin(paginate);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
