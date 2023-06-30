const httpStatus = require('http-status');
const { Enquiry } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a enquiry
 * @param {Object} enquiryBody
 * @returns {Promise<Enquiry>}
 */
const createEnquiry = async (enquiryBody) => {
  return Enquiry.create(enquiryBody);
};

/**
 * Query for enquiry
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryEnquiries = async (filter, options) => {
  const enquiry = await Enquiry.paginate(filter, options);
  return enquiry;
};

/**
 * Get enquiry by id
 * @param {ObjectId} id
 * @returns {Promise<Enquiry>}
 */
const getEnquiryById = async (id) => {
  return Enquiry.findById(id);
};

const getEnquiryByBusinessId = async (id) => {
  return Enquiry.find({ businessId: id })
};

/**
 * Get enquiry by email
 * @param {string} email
 * @returns {Promise<Enquiry>}
 */
const getEnquiryByEmail = async (email) => {
  return Enquiry.findOne({ email });
};

/**
 * Update enquiry by id
 * @param {ObjectId} enquiryId
 * @param {Object} updateBody
 * @returns {Promise<Enquiry>}
 */
const updateEnquiryById = async (enquiryId, updateBody) => {
  const enquiry = await getEnquiryById(enquiryId);
  Object.assign(enquiry, updateBody);
  await enquiry.save();
  return enquiry;
};

/**
 * Delete enquiry by id
 * @param {ObjectId} enquiryId
 * @returns {Promise<Enquiry>}
 */
const deleteEnquiryById = async (enquiryId) => {
  const enquiry = await getEnquiryById(enquiryId);
  if (!enquiry) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Enquiry not found');
  }
  await enquiry.remove();
  return enquiry;
};

module.exports = {
  createEnquiry,
  queryEnquiries,
  getEnquiryById,
  getEnquiryByEmail,
  updateEnquiryById,
  deleteEnquiryById,
  getEnquiryByBusinessId
};
