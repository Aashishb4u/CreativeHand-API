const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const businessRoute = require('./business.route');
const enquiryRoute = require('./enquiry.route');
const fileUploadRoute = require('./upload-file.route');
const feedbackRoute = require('./feedback.route');
const offerRoute = require('./offer.route');
const paymentRoute = require('./payment.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/business',
    route: businessRoute,
  },
  {
    path: '/upload-file',
    route: fileUploadRoute,
  },
  {
    path: '/enquiry',
    route: enquiryRoute,
  },
  {
    path: '/feedback',
    route: feedbackRoute,
  },
  {
    path: '/offers',
    route: offerRoute,
  }, {
    path: '/payments',
    route: paymentRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
