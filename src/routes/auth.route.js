const express = require('express');
const { register, login, loginAdmin, forgotPassword, resetPassword, getAdmin } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);
router.get('/admin', getAdmin);

module.exports = router;
