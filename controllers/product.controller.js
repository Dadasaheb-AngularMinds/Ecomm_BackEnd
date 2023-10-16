const Product = require('../models/product.model');
const Org = require('../models/org.model');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { authService } = require('../services');
const httpStatus = require('http-status');

const createProduct = asyncHandler(async (req, res) => {
  const { product_name, ...rest } = req.body;
  const user = req.user;

  // Check for duplicate username
  const duplicate = await Product.findOne({ product_name }).lean().exec();
  if (duplicate) {
    return res.status(httpStatus.CONFLICT).json({
      error: 'Bad Request',
      code: httpStatus.CONFLICT,
      message: 'Duplicate product_name',
    });
  }
  const productObject = { product_name, ...rest };
  // Create and store new Product
  try {
    const product = await Product.create(productObject);
    if (product) {
      res.status(201).json({
        result: { message: `New user ${product_name} created`, data: product },
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(httpStatus.CONFLICT).json({
        error: 'Bad Request',
        code: httpStatus.CONFLICT,
        message: 'User already exists with this e-mail',
      });
    } else {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'INTERNAL_SERVER_ERROR',
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }
  }
});



module.exports = {
  createProduct,
};
