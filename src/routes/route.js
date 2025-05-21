const express = require('express');
const router = express.Router();

const { getAllExam, getExam, searchExam, addExam, deleteExam, updateExam, getExamOfUser } = require('../controllers/examController');
const { getQuestion, updateQuestion, deleteQuestion, addQuestion, getAllQuestion } = require('../controllers/questionController');
const { register, login, loginAdmin } = require('../controllers/authController');
const { profile, deleteUser, updatePassword, updateRole, getAllUser, updateName, forgotPassword, resetPassword, getAdmin } = require('../controllers/userController');
const { getSection, addSection, updateSection, deleteSection } = require('../controllers/sectionController');
const { getScore, addScore } = require('../controllers/scoreController');
const { checkLogin, checkRole } = require("../middleware/authMiddleware");

router.get('/exam/', getAllExam);
router.get('/exam/:id', getExam);
router.get('/search', searchExam);
router.post('/register', register);
router.post('/login', login);
router.post('/login/admin', loginAdmin);
router.post('/forgot/password/', forgotPassword);
router.put('/reset/password/', resetPassword);
router.get('/get/admin/', getAdmin);

//da dang nhap
router.post('/exam/', checkLogin, addExam);
router.get('/user/exam/', checkLogin, getExamOfUser);
router.put('/user/update/password/', checkLogin, updatePassword);
router.get("/profile", checkLogin, profile);

//only admin
router.get('/user/', checkRole, getAllUser);
router.put('/user/update/role/:id', checkRole, updateRole);
router.delete('/user/delete/:userId', checkRole, deleteUser);
router.delete('/exam/delete/:examId', checkLogin, deleteExam);

// nguoi dung hoac admin
router.post('/user/update/name', checkLogin, updateName);
router.put('/update/exam/:examId', checkLogin, updateExam);

//
router.get('/question/:examId/:sectionId/', checkLogin, getAllQuestion);
router.get('/question/:examId/:sectionId/:questionId', checkLogin, getQuestion);
router.post('/question/:examId/:sectionId', checkLogin, addQuestion);
router.put('/question/:examId/:sectionId/:questionId', checkLogin, updateQuestion);
router.delete('/question/:examId/:sectionId/:questionId', checkLogin, deleteQuestion);

router.get('/score/:examId', checkLogin, getScore);
router.post('/score', checkLogin, addScore);

//
router.get('/exam/:examId/sections', checkLogin, getSection)
router.post('/exam/:examId/sections/', checkLogin, addSection)
router.put('/exam/:examId/sections/:sectionId', checkLogin, updateSection)
router.delete('/exam/:examId/sections/:sectionId', checkLogin, deleteSection)


module.exports = router;