const { toJSON } = require('./plugins');
const mongoose = require('mongoose');

const linkedInPostSchema = mongoose.Schema(
  { postId: String }, { 
    timestamps: true 
  });

// add plugin that converts mongoose to json
linkedInPostSchema.plugin(toJSON);

const linkedInPost = mongoose.model('linkedInPost', linkedInPostSchema);

module.exports = linkedInPost;
