const mongoose = require('mongoose');

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
      private: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'admin',
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
