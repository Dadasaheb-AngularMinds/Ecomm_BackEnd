const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authValidation = require('../validations/auth.validation');
const verifyJWT = require('../middlewares/verifyJWT');
const validate = require('../middlewares/validate');

router
.route('/')
.post(productController.createProduct);
 
module.exports = router;
