const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const businessValidation = require('../../validations/business.validation');
const businessController = require('../../controllers/business.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(businessValidation.createBusiness), businessController.createBusiness)
  .get(auth('getUsers'), validate(businessValidation.getBusiness), businessController.getBusiness);

router.post('/renderDemoBusiness', validate(businessValidation.renderDemoBusiness), businessController.renderDemoBusiness);
router.post('/contactUs', validate(businessValidation.contactUs), businessController.contactUs);
router.post('/downloadImage', validate(businessValidation.downloadImage), businessController.downloadImage);

router.post('/views/:businessId', validate(businessValidation.updateViews), businessController.addView);
router.get('/views/:businessId', validate(businessValidation.getViews), businessController.getViews);
router.get('/getProductCard/:productId/:businessId', validate(businessValidation.downloadEnquiryImage), businessController.downloadEnquiryImage);


router
  .route('/:businessId')
  .get(auth('getUsers'), validate(businessValidation.getBusiness), businessController.getBusinessById)
  .patch(auth('manageUsers'), validate(businessValidation.updateBusiness), businessController.updateBusiness);
  // .delete(auth('manageUsers'), validate(businessValidation.deleteUser), businessController.deleteUser);

router
  .route('/image/:businessId')
  .post(auth('manageUsers'), validate(businessValidation.uploadBusinessImage),
    businessController.uploadBusinessImage);

router
  .route('/portfolio/image/:businessId')
  .patch(auth('manageUsers'), validate(businessValidation.uploadPortfolioImages),
    businessController.uploadPortfolioImages);

router.get('/keyword/:keywordUrl', validate(businessValidation.getBusinessByKeyword), businessController.getBusinessByKeyword);

//
// router
//   .route('/keyword/:keywordUrl')
//   .get(auth('manageUsers'), validate(businessValidation.getBusinessByKeyword),
//     businessController.getBusinessByKeyword);


router
  .route('/products/image/:businessId')
  .patch(auth('manageUsers'), validate(businessValidation.uploadProductImage),
    businessController.uploadProductImage);


module.exports = router;
