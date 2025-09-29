const express = require('express');
const { getScore, addScore } = require('../controllers/scoreController');
const { checkLogin } = require("../middleware/authMiddleware");

const router = express.Router({ mergeParams: true });

// exam/:examId/score
router.get('/', checkLogin, getScore);
router.post('/', checkLogin, addScore);

module.exports = router;
