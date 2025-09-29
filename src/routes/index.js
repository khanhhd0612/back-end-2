const express = require('express');
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const examRoutes = require('./exam.route');
const sectionRoutes = require('./section.route');
const scoreRoutes = require('./score.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/exams', examRoutes);
router.use('/exams/:examId/sections', sectionRoutes);
router.use('/exams/:examId/score', scoreRoutes);

module.exports = router;