const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { feedbackService } = require('../services');
const { handleSuccess, handleError, handleSuccessImage } = require('../utils/SuccessHandler');

const createFeedback = catchAsync(async (req, res) => {
  const feedback = await feedbackService.createFeedback(req.body);
  res.status(httpStatus.CREATED).send(feedback);
});

const getFeedbacks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await feedbackService.queryFeedbacks(filter, options);
  res.send(result);
});

const getFeedback = catchAsync(async (req, res) => {
  const feedback = await feedbackService.getFeedbackById(req.params.businessId);
  if (!feedback) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found');
  }
  res.send(feedback);
});

const getFeedbackByBusinessId = catchAsync(async (req, res) => {
  const feedbacks = await feedbackService.getFeedbackByBusinessId(req.params.businessId);
  if (!feedbacks) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found');
  }
  handleSuccess(httpStatus.OK, { feedbacks }, '', req, res);
});

const updateFeedback = catchAsync(async (req, res) => {
  const businessId = req.body.businessId;
  const feedback = await feedbackService.updateFeedbackById(req.params.feedbackId, businessId, req.body);
  res.send(feedback);
});

const deleteFeedback = catchAsync(async (req, res) => {
  await feedbackService.deleteFeedbackById(req.params.businessId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createFeedback,
  getFeedbacks,
  getFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackByBusinessId
};
