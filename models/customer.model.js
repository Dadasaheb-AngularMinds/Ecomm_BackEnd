const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
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
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      trim: true,
      private: true, // used by the private plugin
    },
    role: {
      type: String,
      default: 'Customer',
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

module.exports = mongoose.model('Customer', customerSchema);
