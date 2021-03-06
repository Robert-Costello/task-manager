const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {type: String, trim: true, required: true},
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
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
  tokens: [
    {
      token: {type: String, required: true},
    },
  ],
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({_id: user._id.toString()}, 'thisissomething');
  user.tokens.push({token});
  console.log('generateAuthToken user save');
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({email});

  if (!user) {
    throw new Error('Unable to login user');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login user');
  } else return user;
};

// Hash plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
    console.log(user);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
