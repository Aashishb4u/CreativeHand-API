const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { enquiryService } = require('../services');

const createEnquiry = catchAsync(async (req, res) => {
  const enquiry = await enquiryService.createEnquiry(req.body);
  res.status(httpStatus.CREATED).send(enquiry);
});

const getEnquiries = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await enquiryService.queryEnquiries(filter, options);
  res.send(result);
});

const getEnquiry = catchAsync(async (req, res) => {
  const enquiry = await enquiryService.getEnquiryById(req.params.enquiryId);
  if (!enquiry) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Enquiry not found');
  }
  res.send(enquiry);
});

const getEnquiryByBusinessId = catchAsync(async (req, res) => {
  const enquiry = await enquiryService.getEnquiryByBusinessId(req.params.businessId);
  if (!enquiry) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Enquiry not found');
  }
  res.send({enquiry});
});

const updateEnquiry = catchAsync(async (req, res) => {
  const enquiry = await enquiryService.updateEnquiryById(req.params.enquiryId, req.body);
  res.send(enquiry);
});

const deleteEnquiry = catchAsync(async (req, res) => {
  await enquiryService.deleteEnquiryById(req.params.enquiryId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiryByBusinessId
};
