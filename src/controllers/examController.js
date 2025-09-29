const Exam = require('../models/Exam')
const Score = require('../models/ExamScore')
const slugify = require('slugify')
const cloudinary = require('../config/cloudinary')

// Lấy tất cả exam public (có phân trang)
exports.getAllExam = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const totalItems = await Exam.countDocuments({ isPublic: true })

        const exams = await Exam.find({ isPublic: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name')

        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            exams
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Lấy 1 exam public theo id
exports.getExam = async (req, res) => {
    try {
        const exam = await Exam.findOne({
            _id: req.params.id,
            isPublic: true
        }).populate('createdBy', 'name')

        if (!exam) {
            return res.status(404).json({ message: 'Không tìm thấy đề thi' })
        }

        res.json(exam)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Lấy danh sách exam của user (có phân trang)
exports.getExamOfUser = async (req, res) => {
    try {
        const userId = req.user.id
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const totalItems = await Exam.countDocuments({ createdBy: userId })

        const exams = await Exam.find({ createdBy: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name')

        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            exams
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Tìm kiếm exam public theo tên
exports.searchExam = async (req, res) => {
    try {
        const query = req.query.q || ''
        const exams = await Exam.find({
            name: { $regex: query, $options: 'i' },
            isPublic: true
        }).populate('createdBy', 'name')

        res.json(exams)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Thêm exam mới
exports.addExam = async (req, res) => {
    try {
        const { name, timeLimit } = req.body
        const isPublic = req.body.isPublic === 'true' || req.body.isPublic === true
        const createdBy = req.user.id

        if (!name || !req.body.sections) {
            return res.status(400).json({ message: 'Cần nhập name và sections' })
        }

        let sections = req.body.sections
        if (typeof sections === 'string') {
            try {
                sections = JSON.parse(sections)
            } catch {
                return res.status(400).json({ message: 'Sections không hợp lệ' })
            }
        }

        if (!Array.isArray(sections)) {
            return res.status(400).json({ message: 'Sections phải là mảng' })
        }

        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: 'Chưa upload ảnh' })
        }

        const image = req.files.image
        const uploadResult = await cloudinary.uploader.upload(
            image.tempFilePath || image.data,
            { folder: 'exams' }
        )

        const slug = slugify(name, { lower: true, strict: true })

        const newExam = new Exam({
            name,
            slug,
            timeLimit,
            isPublic,
            imageUrl: uploadResult.secure_url,
            imageId: uploadResult.public_id,
            createdBy,
            sections
        })

        await newExam.save()

        res.status(201).json({ message: 'Đã tạo đề thi', exam: newExam })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Cập nhật exam (cần middleware isExamOwnerOrAdmin gắn req.exam)
exports.updateExam = async (req, res) => {
    try {
        const exam = req.exam // lấy từ middleware
        const { name, timeLimit, isPublic } = req.body

        if (name) {
            exam.name = name
            exam.slug = slugify(name, { lower: true, strict: true })
        }
        if (timeLimit !== undefined) {
            exam.timeLimit = timeLimit
        }
        if (isPublic !== undefined) {
            exam.isPublic = isPublic === 'true' || isPublic === true
        }

        await exam.save()
        res.json({ message: 'Cập nhật thành công', exam })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.deleteExam = async (req, res) => {
    try {
        const exam = req.exam

        if (exam.imageId) {
            await cloudinary.uploader.destroy(exam.imageId)
        }

        await Score.deleteMany({ examId: exam._id })
        await Exam.findByIdAndDelete(exam._id)

        res.json({ message: 'Đã xóa đề thi' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
