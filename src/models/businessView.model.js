const bcrypt = require('bcryptjs');
const {toJSON, paginate} = require('./plugins');
const {roles} = require('../config/roles');
const mongoose = require('mongoose');

const businessViewSchema = mongoose.Schema(
    {
        businessId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Business',
        },
        pageName: String,
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
businessViewSchema.plugin(toJSON);
businessViewSchema.plugin(paginate);

const BusinessView = mongoose.model('BusinessView', businessViewSchema);

module.exports = BusinessView;
