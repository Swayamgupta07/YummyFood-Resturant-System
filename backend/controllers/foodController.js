const mongoose = require('mongoose');
const Food = require('../models/Food');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAllFoods = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludeFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludeFields.forEach(el => delete queryObj[el]);

  if (req.query.isVeg) {
    queryObj.isVeg = req.query.isVeg === 'true';
  }

  if (req.query.search) {
    queryObj.name = { $regex: req.query.search, $options: 'i' };
  }

  const foods = await Food.find(queryObj);

  res.status(200).json({
    status: 'success',
    results: foods.length,
    data: { foods }
  });
});

exports.getFoodById = catchAsync(async (req, res, next) => {
  let food;
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    food = await Food.findById(req.params.id);
  } else {
    const searchPattern = req.params.id.split('-').join('[- ]');
    food = await Food.findOne({
      name: { $regex: new RegExp(`^${searchPattern}$`, 'i') }
    });
  }

  if (!food) {
    return next(new AppError('No food item found with that ID or name', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { food }
  });
});

exports.createFood = catchAsync(async (req, res, next) => {
  const { name, price, description, category, freeDelivery, isVeg } = req.body;

  let imageUrl;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  } else if (req.body.imageUrl) {
    imageUrl = req.body.imageUrl;
  } else {
    return next(new AppError('Please upload an image or provide an imageUrl string', 400));
  }

  const newFood = await Food.create({
    name,
    price,
    description,
    category,
    freeDelivery: freeDelivery === 'true' || freeDelivery === true,
    isVeg: isVeg === 'true' || isVeg === true,
    imageUrl
  });

  res.status(201).json({
    status: 'success',
    data: { food: newFood }
  });
});

exports.updateFood = catchAsync(async (req, res, next) => {
  const updateData = { ...req.body };

  if (req.file) {
    updateData.imageUrl = `/uploads/${req.file.filename}`;
  }

  if (updateData.freeDelivery !== undefined) {
    updateData.freeDelivery = updateData.freeDelivery === 'true' || updateData.freeDelivery === true;
  }
  if (updateData.isVeg !== undefined) {
    updateData.isVeg = updateData.isVeg === 'true' || updateData.isVeg === true;
  }
  if (updateData.active !== undefined) {
    updateData.active = updateData.active === 'true' || updateData.active === true;
  }

  const food = await Food.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  if (!food) {
    return next(new AppError('No food item found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { food }
  });
});

exports.deleteFood = catchAsync(async (req, res, next) => {
  const food = await Food.findByIdAndDelete(req.params.id);
  if (!food) {
    return next(new AppError('No food item found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.addReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return next(new AppError('Rating and comment are required', 400));
  }

  const food = await Food.findById(req.params.id);
  if (!food) {
    return next(new AppError('No food item found with that ID', 404));
  }

  const newReview = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  food.reviews.push(newReview);

  const totalRating = food.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  food.rating = Number((totalRating / food.reviews.length).toFixed(1));

  await food.save();

  res.status(201).json({
    status: 'success',
    data: { food }
  });
});
