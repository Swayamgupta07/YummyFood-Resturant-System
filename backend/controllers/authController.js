const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Otp = require('../models/Otp');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: '90d' }
  );
};

exports.sendOtp = catchAsync(async (req, res, next) => {
  const { phone } = req.body;

  if (!phone) {
    return next(new AppError('Phone number is required', 400));
  }

  const user = await User.findOne({ phone });
  if (!user) {
    return next(new AppError('User not registered. Please register first.', 404));
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  await Otp.findOneAndUpdate(
    { phone },
    { otp, createdAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('\n----------------------------------------');
  console.log(`[MOCK SMS] OTP for ${phone} is: ${otp}`);
  console.log('----------------------------------------\n');

  res.status(200).json({
    status: 'success',
    message: 'OTP sent successfully (Check backend console/terminal)'
  });
});

exports.verifyOtp = catchAsync(async (req, res, next) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return next(new AppError('Phone number and OTP are required', 400));
  }

  const otpRecord = await Otp.findOne({ phone });

  if (!otpRecord || otpRecord.otp !== otp) {
    return next(new AppError('Invalid or expired OTP', 400));
  }

  const user = await User.findOne({ phone });

  if (!user) {
    return next(new AppError('User not registered. Please register first.', 404));
  }

  const token = signToken(user._id, user.role);

  await Otp.deleteOne({ phone });

  res.status(200).json({
    status: 'success',
    token,
    user
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user._id, user.role);

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
    user
  });
});

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, phone, password} = req.body;

  if (!phone && !email) {
    return next(new AppError('Please provide either a phone number or email address', 400));
  }

  if (phone) {
    const existingUser = await User.findOne({ phone });
    if (existingUser) return next(new AppError('Phone number already registered', 400));
  }
  if (email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new AppError('Email already registered', 400));
  }

  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 12);
  }

  const newUser = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role: 'CUSTOMER'
  });

  const token = signToken(newUser._id, newUser.role);

  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    token,
    user: newUser
  });
});
