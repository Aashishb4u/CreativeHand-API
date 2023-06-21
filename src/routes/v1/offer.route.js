const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const businessValidation = require('../../validations/business.validation');
const businessController = require('../../controllers/business.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(businessValidation.createOffer), businessController.createOffer)
  .get(auth('getUsers'), validate(businessValidation.getOffers), businessController.getOffers);

// router
//   .route('/:offerId')
//   .get(auth('getUsers'), validate(businessValidation.getBusiness), businessController.getBusinessById)
//   .patch(auth('manageUsers'), validate(businessValidation.updateBusiness), businessController.updateBusiness);
// .delete(auth('manageUsers'), validate(businessValidation.deleteUser), businessController.deleteUser);


module.exports = router;
