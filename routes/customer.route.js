const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const loginLimiter = require('../middlewares/loginLimiter');
const authValidation = require('../validations/auth.validation');
const verifyJWT = require('../middlewares/verifyJWT');
const validate = require('../middlewares/validate');
const notesController = require('../controllers/notes.controller')

router.route('/register').post(customerController.createNewCustomer);
router.route('/').get(customerController.getAllCustomers);
router
  .route('/')
  .patch(verifyJWT, customerController.updateCustomer)
  .delete(customerController.deleteCustomer);
router.post(
  '/login',
  loginLimiter,
  // validate(authValidation.login),
  customerController.login
);
router.route('/refresh').get(verifyJWT, customerController.refresh);
router.route('/logout').post(customerController.logout);

router.route('/note')
    .get(notesController.getAllNotes)
    .post(notesController.createNewNote)
     

module.exports = router;
