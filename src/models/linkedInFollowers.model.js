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
    },
    email: {
      type: String,
      default: null
    },
    emailOutreachStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'email_missing'],
      default: 'pending'
    },
    linkedinOutreachStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'restricted_degree'],
      default: 'pending'
    },
    outreachDone: {
      type: Boolean,
      default: false
    },
    lastOutreachAt: {
      type: Date,
      default: null
    },
    outreachAttempts: {
      type: Number,
      default: 0
    },
    profileId: {
      type: String,
      default: ''
    },
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
linkedInFollowersSchema.plugin(toJSON);

const linkedInFollowers = mongoose.model('linkedInFollowersTest', linkedInFollowersSchema);

module.exports = linkedInFollowers;
