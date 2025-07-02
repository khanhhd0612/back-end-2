const cloudinary = require('../config/cloudinary');
const Exam = require('../models/Exam')

exports.addQuestion = async (req, res) => {
    const { examId, sectionId } = req.params
    const { text, answers, correctAnswers } = req.body
    const { id, role } = req.user
    try {
        const exam = await Exam.findById(examId).populate('createdBy', 'name')
        if (!exam) return res.status(404).json({ message: 'Không tìm thấy bài thi' })
        if (id != exam.createdBy.id && role != "admin") return res.status(404).json({ message: 'Bạn không có quyền chỉnh sửa đối với bài thi của người khác' })

        const section = exam.sections.id(sectionId)
        if (!section) return res.status(404).json({ message: 'Không tìm thấy section' })

        const newQuestion = {
            text,
            answers,
            correctAnswers
        }
        section.questions.push(newQuestion)
        await exam.save()
        res.status(200).json({ message: 'Thêm câu hỏi thành công', question: section.questions[section.questions.length - 1] });

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
exports.addImageQuestion = async (req, res) => {
    const { examId, sectionId } = req.params
    const { text, answers, correctAnswers } = req.body
    const { id, role } = req.user
    const image = req.files.image

    try {
        const exam = await Exam.findById(examId).populate('createdBy', 'name')
        if (!exam) return res.status(404).json({ message: 'Không tìm thấy bài thi' })
        if (id != exam.createdBy.id && role != "admin") return res.status(404).json({ message: 'Bạn không có quyền chỉnh sửa đối với bài thi của người khác' })

        const section = exam.sections.id(sectionId)
        if (!section) return res.status(404).json({ message: 'Không tìm thấy section' })

        const uploadResult = await cloudinary.uploader.upload(
            image.tempFilePath || image.data,
            { folder: 'questions' }
        )
        const parsedAnswers = typeof answers === 'string' ? JSON.parse(answers) : answers;
        const newQuestion = {
            text,
            answers: parsedAnswers,
            correctAnswers,
            imageUrl: uploadResult.secure_url,
            imageId: uploadResult.public_id,
            isQuestionImage: true
        }

        section.questions.push(newQuestion)
        await exam.save()
        res.status(201).json({ message: 'Thêm câu hỏi thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
exports.getQuestion = async (req, res) => {
    const { examId, sectionId, questionId } = req.params
    const { id, role } = req.user
    try {
        const exam = await Exam.findById(examId).populate('createdBy', 'name')
        if (!exam) return res.status(404).json({ message: 'Không tìm thấy bài thi' })
        if (id != exam.createdBy.id && role != "admin") return res.status(404).json({ message: 'Bạn không có quyền đối với bài thi của người khác' })

        const section = exam.sections.id(sectionId)
        if (!section) return res.status(404).json({ message: 'Không tìm thấy section' })

        const question = section.questions.id(questionId)
        if (!question) return res.status(404).json({ message: 'Không tìm thấy câu hỏi' })

        res.status(200).json({ question })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getAllQuestion = async (req, res) => {
    const { examId, sectionId } = req.params
    const { id, role } = req.user
    try {
        const exam = await Exam.findById(examId).populate('createdBy', 'name')
        if (!exam) return res.status(404).json({ message: 'Không tìm thấy bài thi' })
        if (id != exam.createdBy.id && role != "admin") return res.status(404).json({ message: 'Bạn không có quyền đối với bài thi của người khác' })

        const section = exam.sections.id(sectionId)
        if (!section) return res.status(404).json({ message: 'Không tìm thấy section' })

        const question = section.questions

        res.status(200).json({ section })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.updateQuestion = async (req, res) => {
    const { examId, sectionId, questionId } = req.params
    const { text, answers, correctAnswers } = req.body
    const { id, role } = req.user
    try {
        const exam = await Exam.findById(examId).populate('createdBy', 'name')
        if (!exam) return res.status(404).json({ message: 'Không tìm thấy bài thi' })
        if (id != exam.createdBy.id && role != "admin") return res.status(404).json({ message: 'Bạn không có quyền chỉnh sửa đối với bài thi của người khác' })

        const section = exam.sections.id(sectionId)
        if (!section) return res.status(404).json({ message: 'Không tìm thấy section' })

        const question = section.questions.id(questionId)
        if (!question) return res.status(404).json({ message: 'Không tìm thấy câu hỏi' })

        if (text) question.text = text
        if (answers) question.answers = answers
        if (correctAnswers) question.correctAnswers = correctAnswers

        await exam.save()
        res.status(200).json({ message: 'Câu hỏi được cập nhật thành công', question })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.deleteQuestion = async (req, res) => {
    const { examId, sectionId, questionId } = req.params;
    const { id, role } = req.user;

    try {
        const exam = await Exam.findById(examId).populate('createdBy', 'name');
        if (!exam) {
            return res.status(404).json({ message: 'Không tìm thấy bài thi' });
        }

        if (id != exam.createdBy.id && role !== "admin") {
            return res.status(403).json({ message: 'Bạn không có quyền xóa đối với bài thi của người khác' });
        }

        const section = exam.sections.id(sectionId);
        if (!section) {
            return res.status(404).json({ message: 'Không tìm thấy section' });
        }

        const questionIndex = section.questions.findIndex(q => q._id.toString() === questionId);
        if (questionIndex === -1) {
            return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
        }

        const question = section.questions[questionIndex];

        if (question.imageId) {
            await cloudinary.uploader.destroy(question.imageId);
        }

        section.questions.splice(questionIndex, 1);
        await exam.save();

        res.status(200).json({ message: 'Câu hỏi được xóa thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};