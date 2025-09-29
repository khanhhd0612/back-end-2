const Exam = require("../models/Exam")

exports.findSectionAndQuestion = (req, res, next) => {
    try {
        const { sectionId, questionId } = req.params
        const exam = req.exam

        const section = exam.sections.id(sectionId)
        if (!section) {
            return res.status(404).json({ message: "Không tìm thấy section" })
        }

        req.section = section

        if (questionId) {
            const question = section.questions.id(questionId)
            if (!question) {
                return res.status(404).json({ message: "Không tìm thấy câu hỏi" })
            }
            req.question = question
        }

        next()
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
exports.isExamOwnerOrAdmin = async (req, res, next) => {
    try {
        const { examId } = req.params
        const { id, role } = req.user

        const exam = await Exam.findById(examId).populate('createdBy', '_id')
        if (!exam) {
            return res.status(404).json({ message: 'Không tìm thấy bài thi' })
        }

        req.exam = exam
        
        if (id != exam.createdBy.id && role !== "admin") {
            return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa bài thi này' })
        }

        next()
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}