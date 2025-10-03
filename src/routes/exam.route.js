const express = require('express');
const { getAllExam, getExam, searchExam, addExam, deleteExam, updateExam, getExamOfUser, searchExamOfUser } = require('../controllers/examController');
const { checkLogin } = require("../middleware/authMiddleware");
const { isExamOwnerOrAdmin } = require("../middleware/examMiddleware");

const router = express.Router();

router.get('/', getAllExam);

router.get('/search', searchExam);

router.get('/:id', getExam);

router.get('/user/list', checkLogin, getExamOfUser);

router.get('/user/search', checkLogin, searchExamOfUser);

router.post('/', checkLogin, addExam);
router.put('/:examId', checkLogin, isExamOwnerOrAdmin, updateExam);
router.delete('/:examId', checkLogin, isExamOwnerOrAdmin, deleteExam);

module.exports = router;
