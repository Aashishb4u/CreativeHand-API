const express = require('express');
const validate = require('../../middlewares/validate');
const contactValidation = require('../../validations/portfolio/contact.validation');
const contactController = require('../../controllers/portfolio/contact.controller');
const router = express.Router();

// api/portfolio/contact/initiate - End Point
router.post('/initiate', validate(contactValidation.email), contactController.sendEmail);
router.post('/linkedIn_mail', validate(contactValidation.linkedin_email), contactController.sendLinkedInEmail);

// GET endpoints for LinkedIn followers
router.get('/linkedin/followers', contactController.getLinkedInFollowers);
router.post('/linkedin/followers/set', validate(contactValidation.linkedin_followers), contactController.setLinkedInFollowers);
router.post('/linkedin/followers/:profileId/update', validate(contactValidation.updateFollower), contactController.updateLinkedInFollowerById);
module.exports = router;