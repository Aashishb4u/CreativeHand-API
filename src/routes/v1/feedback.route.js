const express = require('express');
const validate = require('../../middlewares/validate');
const feedbackValidation = require('../../validations/feedback.validation');
const feedbackController = require('../../controllers/feedback.controller');

const router = express.Router();

router.post('/', validate(feedbackValidation.createFeedback), feedbackController.createFeedback);
router.patch('/:feedbackId', validate(feedbackValidation.updateFeedback), feedbackController.updateFeedback);
router.get('/:businessId', validate(feedbackValidation.getFeedback), feedbackController.getFeedbackByBusinessId);
router.get('/', validate(feedbackValidation.getFeedbacks), feedbackController.getFeedbacks);

module.exports = router;
