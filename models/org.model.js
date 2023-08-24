const mongoose = require('mongoose');

const orgSchema = mongoose.Schema(
  {
    _createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    //   logo: {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'File'
    //   },

    address: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Organization = mongoose.model(
  'organizations',
  orgSchema,
  'organizations'
);

module.exports = Organization;
