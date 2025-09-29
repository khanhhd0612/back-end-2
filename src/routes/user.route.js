const express = require('express');
const { profile, deleteUser, updatePassword, updateRole, getAllUser, updateName } = require('../controllers/userController');
const { checkLogin, checkRole } = require("../middleware/authMiddleware");

const router = express.Router();

// user tự thao tác
router.get('/profile', checkLogin, profile);
router.put('/password', checkLogin, updatePassword);
router.put('/name', checkLogin, updateName);

// admin quản lý user
router.get('/', checkRole, getAllUser);
router.put('/:id/role', checkRole, updateRole);
router.delete('/:id', checkRole, deleteUser);

module.exports = router;
