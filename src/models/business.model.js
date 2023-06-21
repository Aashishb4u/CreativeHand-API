const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const {toJSON, paginate} = require('./plugins');
const {roles} = require('../config/roles');

const businessSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    business: {
      businessImageUrl: String,
      businessName: {
        type: String,
        minlength: 2
      },
      businessType: {
        type: String,
      },
      estYear: String,
      qualification: {
        type: String,
      },
      contactNumbers: [{
        number: {
          type: String,
          default: ''
        },
        isPrimary: {
          type: Boolean,
          default: false
        },
      }],
      website: {
        type: String,

      },
      otherLinks: {
        type: [String],
      }
    },
    address: {
      addressImageUrl: String,
      addressMapLink: {
        type: String,
        raw: true,
      },
      addressLine: String
    },
    socialMediaLinks: {
      instagram: String,
      facebook: String,
      linkedin: String
    },
    specialities:  Buffer,
    products: [{
      productImageUrl: {
        type: String,
        default: '',
      },
      productName: {
        type: String,
        default: '',
      },
      productDescription: {
        type: String,
        default: '',
      }
    }],
    portfolioImages: [String],
    bankDetails: {
      bankName: String,
      accountName: String,
      accountNumber: String,
      IFSCCode: String,
      accountType: String
    },
    upiPayments: [{
      upiType: String,
      upiUserName: String,
      upiContact: {
        type: String,
      }
    }],
    videoLinks: [{
      videoLink: String,
      videoId: String,
    }],
    keywordUrl: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: ''
    },
    subscriptionStartDate: Date,
    subscriptionEndDate: Date,
    offerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Offer',
      default: null
    },
    template:  {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'pending'
    },
    currentPaymentId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Payment',
      default: null
    },
    paymentStatus: {
      type: String,
      default: 'unpaid'
    },
    executiveId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      default: null
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
businessSchema.plugin(toJSON);
businessSchema.plugin(paginate);

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;

