const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { businessService } = require('../services');
const { picUpload, multipleFileUpload } = require('../utils/fileUpload');
const { handleSuccess, handleError } = require('../utils/SuccessHandler');

const uploadFile = catchAsync(async (req, res) => {
  picUpload(req, res, (err, data) => {
    if (err) {
      handleError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Image is not uploaded', req, res, err);
    } else {
      const filePath = req.file && req.file.filename ? `public/${req.file.filename}` : 'public/no-image.png';
      handleSuccess(httpStatus.CREATED, { filePath }, 'File Uploaded Successfully.', req, res);
    }
  });

});

const uploadMultipleFiles = catchAsync(async (req, res) => {
  multipleFileUpload(req, res, (err, data) => {
    if (err) {
      handleError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Images are not uploaded', req, res, err);
    } else {
      const fileData = req.files.map((file) => ({
        fileName: file.filename,
        filePath: `public/${file.filename}`,
      }));
      handleSuccess(httpStatus.CREATED, { files: fileData }, 'Files Uploaded Successfully.', req, res);
    }
  });
});

module.exports = {
  uploadFile,
  uploadMultipleFiles
};
