const express = require('express')
const { getSection, addSection, updateSection, deleteSection } = require('../controllers/sectionController')
const { checkLogin } = require("../middleware/authMiddleware")
const { isExamOwnerOrAdmin } = require("../middleware/examMiddleware")
const questionRoutes = require('./question.route')

const router = express.Router({ mergeParams: true })

router.get('/', checkLogin, isExamOwnerOrAdmin, getSection)
router.post('/', checkLogin, isExamOwnerOrAdmin, addSection)
router.put('/:sectionId', checkLogin, isExamOwnerOrAdmin, updateSection)
router.delete('/:sectionId', checkLogin, isExamOwnerOrAdmin, deleteSection)

router.use('/:sectionId/questions', checkLogin, isExamOwnerOrAdmin, questionRoutes)

module.exports = router