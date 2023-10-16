const express = require('express');
const multer = require('multer');
const router = express.Router();
const authValidation = require('../validations/auth.validation');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const fileController = require('../controllers/file.controller');
const verifyJWT = require('../middlewares/verifyJWT');
  
router
.route('/')
.post(upload.single('file'),fileController.uploadFile);
 
module.exports = router;
