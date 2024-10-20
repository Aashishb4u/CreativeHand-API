const { toJSON } = require('./plugins');
const mongoose = require('mongoose');

const linkedInEmailSchema = mongoose.Schema(
    { email: String }, {
        timestamps: true
    });

// add plugin that converts mongoose to json
linkedInEmailSchema.plugin(toJSON);

const linkedInEmail = mongoose.model('linkedInEmail', linkedInEmailSchema);

module.exports = linkedInEmail;
