const express = require('express');
const validate = require('../../middlewares/validate');
const enquiryValidation = require('../../validations/enquiry.validation');
const enquiryController = require('../../controllers/enquiry.controller');

const router = express.Router();

router.post('/', validate(enquiryValidation.createEnquiry), enquiryController.createEnquiry);
router.patch('/:enquiryId', validate(enquiryValidation.updateEnquiry), enquiryController.updateEnquiry);
router.get('/:businessId', validate(enquiryValidation.getEnquiry), enquiryController.getEnquiryByBusinessId);
router.get('/', validate(enquiryValidation.getEnquiries), enquiryController.getEnquiries);

module.exports = router;
