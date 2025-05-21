const Score = require('../models/ExamScore')
const Exam = require('../models/Exam')

exports.getScore = async (req, res) => {
    const examId = req.params.examId
    const { id, role } = req.user
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    try {

        const oneScore = await Score.findOne({ examId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('examId', 'name')

        if (!oneScore) return res.status(404).json({ message: "Không tìm thấy điểm nào" })

        const createdBy = oneScore.examId.createdBy

        if (id != createdBy && role !== "admin") return res.status(404).json({ message: "Bạn không có quyền xem" })

        const totalItems = await Score.countDocuments({ examId })
        const score = await Score.find({
            examId: examId
        }).populate('userId', 'name email')
        if (score) {
            res.status(200).json({
                score: score,
                totalPages: Math.ceil(totalItems / limit),
                nameExam: oneScore.examId.name
            })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
exports.addScore = async (req, res) => {
    const { examId, score, time } = req.body
    const userId = req.user.id
    try {
        if (!examId || !score) return res.status(404).json({ messgae: "Thiếu dữ liệu" })
        const newScore = new Score({
            examId,
            score,
            time,
            userId
        })
        await newScore.save()
        res.status(200).json({ message: "success" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
