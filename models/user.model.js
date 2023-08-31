const mongoose = require('mongoose');
const {roles} = require('../config/roles')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: false,
      trim: true,
    },
    last_name: {
      type: String,
      required: false,
      trim: true,
    },
    _org: {
      type: mongoose.Types.ObjectId,
      ref: 'organizations',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
      trim: true,
      private: true, // used by the private plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'User',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      countryCode: { type: String },
      number: { type: String },
    },
    profilePicture: {
      type: mongoose.Types.ObjectId,
      ref: 'File',
    },
    timeZone: {
      type: Number,
      default: 330,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
