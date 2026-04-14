// routes/auth.js - Authentication routes
const express = require('express');
const router = express.Router();
const { registerCompany, loginCompany, governmentLogin } = require('../controllers/authController');

// Company registration
router.post('/register', registerCompany);

// Company login
router.post('/login', loginCompany);

// Government login (hardcoded)
router.post('/government-login', governmentLogin);

module.exports = router;
