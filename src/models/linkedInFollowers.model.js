const { toJSON } = require('./plugins');
const mongoose = require('mongoose');

const linkedInFollowersSchema = mongoose.Schema(
  {
    acceptButtonText: {
      type: String,
      default: null
    },
    acceptLabel: {
      type: String,
      default: null
    },
    avatar: String,
    caption: String,
    degree: String,
    headline: String,
    mutualConnections: String,
    name: String,
    profileUrl: String
  },
  {
    timestamps: true
  }
);


// add plugin that converts mongoose to json
linkedInFollowersSchema.plugin(toJSON);

const linkedInFollowers = mongoose.model('linkedInFollowers', linkedInFollowersSchema);

module.exports = linkedInFollowers;
