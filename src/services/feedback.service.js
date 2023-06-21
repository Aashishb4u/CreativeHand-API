const httpStatus = require('http-status');
const { Feedback } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a feedback
 * @param {Object} feedbackBody
 * @returns {Promise<Feedback>}
 */
const createFeedback = async (feedbackBody) => {
  return Feedback.create(feedbackBody);
};

/**
 * Query for feedback
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFeedbacks = async (filter, options) => {
  const feedback = await Feedback.paginate(filter, options);
  return feedback;
};

/**
 * Get feedback by id
 * @param {ObjectId} id
 * @returns {Promise<Feedback>}
 */
const getFeedbackByBusinessId = async (id) => {
  return Feedback.find({ businessId: id });
};

const getFeedbackById = async (id) => {
  return Feedback.findById(id);
};

/**
 * Get feedback by email
 * @param {string} email
 * @returns {Promise<Feedback>}
 */
const getFeedbackByEmail = async (email) => {
  return Feedback.findOne({ email });
};

/**
 * Update feedback by id
 * @param {ObjectId} businessId
 * @param {Object} updateBody
 * @returns {Promise<Feedback>}
 */
const updateFeedbackById = async (feedbackId, businessId, updateBody) => {
  const feedback = await Feedback.findOne({ businessId: businessId, _id: feedbackId});
  if (!feedback) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found');
  }
  Object.assign(feedback, updateBody);
  await feedback.save();
  return feedback;
};

/**
 * Delete feedback by id
 * @param {ObjectId} feedbackId
 * @returns {Promise<Feedback>}
 */
const deleteFeedbackById = async (feedbackId) => {
  const feedback = await getFeedbackById(feedbackId);
  if (!feedback) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found');
  }
  await feedback.remove();
  return feedback;
};

module.exports = {
  createFeedback,
  queryFeedbacks,
  getFeedbackByBusinessId,
  getFeedbackByEmail,
  updateFeedbackById,
  deleteFeedbackById,
};
