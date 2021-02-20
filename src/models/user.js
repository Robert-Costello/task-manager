const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
  name: {type: String, trim: true, required: true},
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    validate(val) {
      if (!validator.isEmail(val)) throw new Error('Email is not valid');
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(val) {
      if (val.toLowerCase().includes('password')) {
        throw new Error("password can't contain 'password'");
      }
    },
  },
  age: {
    type: Number,
    default: 100,
    min: 18,
    validate(val) {
      if (val > 150) {
        throw new Error("Stop playin'.");
      }
    },
  },
});

module.exports = User;
