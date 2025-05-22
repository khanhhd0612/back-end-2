const Exam = require('../models/Exam')
const Score = require('../models/ExamScore')
const slugify = require('slugify')
const cloudinary = require('../config/cloudinary');

exports.getAllExam = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const totalItems = await Exam.countDocuments()

        const exams = await Exam.find({ isPublic: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name')
        res.json({
            exam: exams,
            totalPages: Math.ceil(totalItems / limit)
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}
exports.getExam = async (req, res) => {
    try {
        const exam = await Exam.findOne({
            _id: req.params.id,
            isPublic: true
        }).populate('createdBy', 'name');
        if (!exam) {
            return res.status(404).json({ message: 'Không tìm thấy đề thi' });
        }
        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getExamOfUser = async (req, res) => {
    try {
        const id = req.user.id
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const totalItems = await Exam.countDocuments({ createdBy: id })

        const exam = await Exam.find({ createdBy: id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name')
        if (!exam) {
            return res.status(404).json({ message: 'Không tìm thấy đề thi' })
        }
        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems: totalItems,
            exam: exam
        })
    } catch (error) {
        res.status(500).json({ message: err.message })
    }
}
exports.searchExam = async (req, res) => {
    try {
        const query = req.query.q
        const exam = await Exam.find({
            name: { $regex: query, $options: 'i' },
            isPublic: true
        }).populate('createdBy', 'name')
        if (!exam) {
            return res.status(404).json({ message: 'Không tìm thấy đề thi' })
        }
        res.json(exam)
    } catch (error) {
        res.status(500).json({ message: err.message })
    }
}
exports.addExam = async (req, res) => {
    try {
        const { name, timeLimit } = req.body;
        const isPublic = req.body.isPublic === 'true';
        const createdBy = req.user.id;

        let sections = req.body.sections;
        if (!name || !sections) {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ: cần có name và sections' });
        }

        if (typeof sections === 'string') {
            try {
                sections = JSON.parse(sections);
            } catch (e) {
                return res.status(400).json({ message: 'Sections không phải là JSON hợp lệ' });
            }
        }

        if (!Array.isArray(sections)) {
            return res.status(400).json({ message: 'Sections phải là mảng' });
        }

        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: 'Chưa upload ảnh' });
        }

        const image = req.files.image;

        const uploadResult = await cloudinary.uploader.upload(
            image.tempFilePath || image.data,
            { folder: 'exams' }
        );

        const slug = slugify(name, {
            lower: true,
            strict: true
        });

        const newExam = new Exam({
            name,
            slug,
            timeLimit,
            isPublic,
            imageUrl: uploadResult.secure_url,
            createdBy,
            sections
        });

        await newExam.save();

        res.status(201).json({ message: 'Đề thi đã được lưu', exam: newExam });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.updateExam = async (req, res) => {
    const examId = req.params.examId
    const name = req.body.name
    const timeLimit = req.body.timeLimit
    const isPublic = req.body.isPublic
    const { id, role } = req.user
    try {
        const exam = await Exam.findById(examId).populate('createdBy', 'name')
        if (!exam) res.status(404).json({ message: 'Không tìm thấy bài thi' })
        if (id != exam.createdBy.id && role != "admin") return res.status(404).json({ message: 'Bạn không có quyền chỉnh sửa đối với bài thi của người khác' })
        if (name) {
            const slug = slugify(name, {
                lower: true,
                strict: true
            })
            exam.name = name
            exam.slug = slug
        }
        if (isPublic === true) {
            exam.isPublic = isPublic
        } else if (isPublic === false) {
            exam.isPublic = isPublic
        }
        if(timeLimit) {
            exam.timeLimit= timeLimit
        }
        await exam.save()
        res.status(200).json({ message: 'Cập nhật thành công' })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
exports.deleteExam = async (req, res) => {
    try {
        const { id, role } = req.user;
        const examId = req.params.examId;

        const exam = await Exam.findById(examId).populate('createdBy', 'name');
        if (!exam) return res.status(404).json({ message: 'Không tìm thấy bài thi' });
        if (id != exam.createdBy.id && role != "admin") {
            return res.status(404).json({ message: 'Bạn không có quyền xóa bài thi này' });
        }
        await Exam.findByIdAndDelete(examId);
        await Score.deleteMany({ examId });

        return res.status(200).json({ message: 'Đã xóa' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}