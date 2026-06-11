const express = require('express');
const authController = require('../controllers/authController');
const validatorMiddleware = require('../middlewares/validatorMiddleware');

const router = express.Router();

router.post('/send-otp', validatorMiddleware.validateSendOtp, authController.sendOtp);

router.post('/verify-otp', validatorMiddleware.validateVerifyOtp, authController.verifyOtp);

router.post('/register', validatorMiddleware.validateRegister, authController.register);

router.post('/login', validatorMiddleware.validateLogin, authController.login);

module.exports = router;
