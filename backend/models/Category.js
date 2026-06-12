const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A category must have a name'],
    unique: true,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'A category must have an image']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
