const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();
const loginLimiter = require('../middlewares/loginLimiter');

router.route('/register').post( authController.register);
router.route('/login').post(loginLimiter, authController.login);
router.route('/refresh').get(authController.refresh);

router.route('/logout').post(authController.logout);

module.exports = router;
