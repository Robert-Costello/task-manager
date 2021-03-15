const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../../../secrets');
const Task = require('../models/task');

const userSchema = mongoose.Schema(
  {
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
    avatar: {
      type: Buffer,
    },
  },
  {timestamps: true}
);

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.tokens;
  delete userObj.avatar;

  return userObj;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({_id: user._id.toString()}, secret);
  user.tokens.push({token});

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
  }
  next();
});

// Delete tasks when user is deleted
userSchema.pre('remove', async (req, res, next) => {
  const user = this;
  await Task.deleteMany({owner: user._id});
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
