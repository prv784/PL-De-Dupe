const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working' });
});

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', auth, authController.getCurrentUser);
router.put('/profile', auth, authController.updateProfile);
router.put('/change-password', auth, authController.changePassword);
router.get('/stats', auth, authController.getUserStats);

module.exports = router;