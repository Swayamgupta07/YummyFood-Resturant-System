const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.updateUserProfile = catchAsync(async (req, res, next) => {
  const { name, email, phone } = req.body;

  if (req.body.password) {
    return next(new AppError('This route is not for password updates.', 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, phone },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});

exports.getAddresses = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    results: user.addresses.length,
    data: { addresses: user.addresses }
  });
});

exports.addAddress = catchAsync(async (req, res, next) => {
  const { street, city, state, zipCode, isDefault } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  user.addresses.push({ street, city, state, zipCode, isDefault });
  await user.save();

  res.status(201).json({
    status: 'success',
    data: { addresses: user.addresses }
  });
});

exports.updateAddress = catchAsync(async (req, res, next) => {
  const { addressId } = req.params;
  const { street, city, state, zipCode, isDefault } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const address = user.addresses.id(addressId);
  if (!address) {
    return next(new AppError('Address not found', 404));
  }

  if (isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  if (street) address.street = street;
  if (city) address.city = city;
  if (state) address.state = state;
  if (zipCode) address.zipCode = zipCode;
  if (isDefault !== undefined) address.isDefault = isDefault;

  await user.save();

  res.status(200).json({
    status: 'success',
    data: { address }
  });
});

exports.deleteAddress = catchAsync(async (req, res, next) => {
  const { addressId } = req.params;

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const address = user.addresses.id(addressId);
  if (!address) {
    return next(new AppError('Address not found', 404));
  }

  user.addresses.pull(addressId);
  await user.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});
