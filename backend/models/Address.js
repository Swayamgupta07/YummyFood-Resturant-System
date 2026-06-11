const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { 
    type: String, 
    required: [true, 'Street is required'] 
  },
  city: { 
    type: String, 
    required: [true, 'City is required'] 
  },
  state: { 
    type: String, 
    required: [true, 'State is required'] 
  },
  zipCode: { 
    type: String, 
    required: [true, 'Zip code is required'] 
  },
  isDefault: { 
    type: Boolean, 
    default: false 
  }
});

module.exports = addressSchema;
