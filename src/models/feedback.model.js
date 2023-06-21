const mongoose = require('mongoose');
const {toJSON} = require('./plugins');

const feedbackSchema = mongoose.Schema(
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
    rating: {
      type: String,
      default: '',
      required: true
    },
    feedback: {
      type: String,
      default: '',
      required: true
    },
    status: {
      type: String,
      default: 'pending'
    },
    businessId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Business',
    },
  },
  {
    timestamps: true,
  });

// add plugin that converts mongoose to json
feedbackSchema.plugin(toJSON);

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
