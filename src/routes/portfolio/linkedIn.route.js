const express = require('express');
const validate = require('../../middlewares/validate');
const contactValidation = require('../../validations/portfolio/profile.validation');
const linkedInController = require('../../controllers/portfolio/linkedIn.controller');
const router = express.Router();


router.post('/save', validate(contactValidation.linkedInPost), linkedInController.saveLinkedInPost);
router.get('/:postId', validate(contactValidation.fetchLinkedInPost), linkedInController.getLinkedInPost);

module.exports = router;