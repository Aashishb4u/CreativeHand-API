const { toJSON } = require('./plugins');
const mongoose = require('mongoose');

const linkedInFollowersSchema = mongoose.Schema(
  {
    acceptButtonText: {
      type: String,
      default: ''
    },
    acceptLabel: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    caption: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      default: ''
    },
    headline: {
      type: String,
      default: ''
    },
    mutualConnections: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      required: true
    },
    profileUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
linkedInFollowersSchema.plugin(toJSON);

const linkedInFollowers = mongoose.model('linkedInFollowers', linkedInFollowersSchema);

module.exports = linkedInFollowers;
