const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

const User = require('../models/user');

// API To Register New User
router.post('/register', userController.validate('validateInputForRegistration'), userController.registerUser);

// get User from auth Token
router.get('/getUser', userController.validate('userIdFromToken'), userController.getUserById);

// get User from Email and Password
router.get('/signIn', userController.validate('checkCredentials') , userController.validateCredentials)

//delete user and profile
router.post("/delete", userController.validate('userIdFromToken'), userController.deleteUser);

module.exports = router;
