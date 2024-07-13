const express = require('express');
const validate = require('../../middlewares/validate');
const contactValidation = require('../../validations/portfolio/contact.validation');
const contactController = require('../../controllers/portfolio/contact.controller');
const router = express.Router();

// api/portfolio/contact/initiate - End Point
router.post('/initiate', validate(contactValidation.email), contactController.sendEmail);

module.exports = router;