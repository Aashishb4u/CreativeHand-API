const multer = require('multer');

const picStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'src/public');
  },
  filename(req, file, callback) {
    callback(null, file.originalname);
  },
});

const picUpload = multer({
  storage: picStorage,
  fileFilter(req, file, callback) {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    if (['jpg', 'png', 'jpeg'].indexOf(fileExtension) === -1) {
      return callback(new Error('Invalid File Extension'));
    }
    callback(null, true);
  },
}).single('file');

const multipleFileUpload = multer({
  storage: picStorage,
  fileFilter(req, file, callback) {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    if (['jpg', 'png', 'jpeg'].indexOf(fileExtension) === -1) {
      return callback(new Error('Invalid File Extension'));
    }
    callback(null, true);
  },
}).array('files');

const parseMultipart = multer({}).array();

module.exports = {
  picUpload,
  multipleFileUpload,
  parseMultipart,
};
