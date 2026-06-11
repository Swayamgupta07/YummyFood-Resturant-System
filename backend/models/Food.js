const mongoose = require('mongoose');
const reviewSchema = require('./Review');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A food item must have a name'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'A food item must have a price'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'A food item must have a description'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'A food item must have an image']
  },
  category: {
    type: String,
    required: [true, 'A food item must have a category'],
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  dateOfLaunch: {
    type: Date,
    default: Date.now
  },
  freeDelivery: {
    type: Boolean,
    default: false
  },
  isVeg: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [reviewSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Food', foodSchema);
