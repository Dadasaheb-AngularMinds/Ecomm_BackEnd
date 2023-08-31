const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const loginLimiter = require('../middlewares/loginLimiter')
const verifyJWT = require('../middlewares/verifyJWT')


router
  .route('/register')
  .post(customerController.createNewCustomer)

router
  .route('/')
  .get(customerController.getAllCustomers)

router
  .route('/')
  .patch(verifyJWT,customerController.updateCustomer)
  .delete(customerController.deleteCustomer);

router.route('/login')
    .post(loginLimiter, customerController.login)

router.route('/refresh')
    .get(customerController.refresh)

router.route('/logout')
    .post(customerController.logout)

module.exports = router
