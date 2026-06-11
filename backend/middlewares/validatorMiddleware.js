const AppError = require('../utils/AppError');

exports.validateSendOtp = (req, res, next) => {
  const { phone } = req.body;
  if (!phone) {
    return next(new AppError('Phone number is required', 400));
  }
  const phoneRegex = /^(?:\+91)?\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return next(new AppError('Invalid phone number format. Please provide a valid 10-digit number.', 400));
  }
  next();
};

exports.validateRegister = (req, res, next) => {
  const { name, email, phone, password } = req.body;

  if (!name) {
    return next(new AppError('Name is required', 400));
  }

  if (email) {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError('Please provide a valid email address', 400));
    }
  }

  if (phone) {
    const phoneRegex = /^(?:\+91)?\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return next(new AppError('Please provide a valid 10-digit phone number', 400));
    }
  }

  if (password && password.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400));
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }

  next();
};

exports.validateVerifyOtp = (req, res, next) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return next(new AppError('Phone number and OTP are required', 400));
  }

  const phoneRegex = /^(?:\+91)?\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return next(new AppError('Invalid phone number format. Please provide a valid 10-digit number.', 400));
  }

  const otpRegex = /^\d{4}$/;
  if (!otpRegex.test(otp)) {
    return next(new AppError('Invalid OTP format. OTP must be a 4-digit number.', 400));
  }

  next();
};
