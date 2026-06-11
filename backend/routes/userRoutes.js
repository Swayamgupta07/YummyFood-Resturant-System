const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.route('/profile')
  .get(userController.getUserProfile)
  .patch(userController.updateUserProfile);

router.route('/addresses')
  .get(userController.getAddresses)
  .post(userController.addAddress);

router.route('/addresses/:addressId')
  .patch(userController.updateAddress)
  .delete(userController.deleteAddress);

module.exports = router;
