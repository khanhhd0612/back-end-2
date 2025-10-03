const express = require('express');
const { getQuestion, updateQuestion, deleteQuestion, addImageQuestion, searchUserQuestions, addQuestion, getAllQuestion, updateImageForQuestion, addImageForQuestion, deleteImageFromQuestion } = require('../controllers/questionController');

const { checkLogin } = require("../middleware/authMiddleware");
const { isExamOwnerOrAdmin, findSectionAndQuestion } = require("../middleware/examMiddleware");

const router = express.Router({ mergeParams: true });

// Lấy tất cả câu hỏi trong section
router.get('/', checkLogin, isExamOwnerOrAdmin, findSectionAndQuestion, getAllQuestion);

// tìm câu hỏi
router.get('/search', checkLogin, isExamOwnerOrAdmin, searchUserQuestions);

// Lấy chi tiết 1 câu hỏi
router.get('/:questionId', checkLogin, isExamOwnerOrAdmin, findSectionAndQuestion, getQuestion);

// Thêm câu hỏi
router.post('/', checkLogin, isExamOwnerOrAdmin, findSectionAndQuestion, addQuestion);

// Thêm câu hỏi có ảnh
router.post('/image', checkLogin, isExamOwnerOrAdmin, findSectionAndQuestion, addImageQuestion);

// Thêm ảnh cho câu hỏi
router.put('/:questionId/add-image', checkLogin, isExamOwnerOrAdmin, findSectionAndQuestion, addImageForQuestion);

// Sửa ảnh cho câu hỏi
router.put('/:questionId/change-image', checkLogin, isExamOwnerOrAdmin, findSectionAndQuestion, updateImageForQuestion);

// Xóa ảnh khỏi câu hỏi
router.delete('/:questionId/delete-image', checkLogin, isExamOwnerOrAdmin, findSectionAndQuestion, deleteImageFromQuestion);

// Cập nhật câu hỏi
router.put('/:questionId', checkLogin, isExamOwnerOrAdmin, findSectionAndQuestion, updateQuestion);

// Xóa câu hỏi
router.delete('/:questionId', checkLogin, isExamOwnerOrAdmin, findSectionAndQuestion, deleteQuestion);

module.exports = router;
