const cloudinary = require("../config/cloudinary")

exports.addQuestion = async (req, res) => {
    try {
        const { text, answers, correctAnswers } = req.body
        const section = req.section

        const newQuestion = { text, answers, correctAnswers }
        section.questions.push(newQuestion)
        await req.exam.save()

        res.status(200).json({ 
            message: "Thêm câu hỏi thành công", 
            question: section.questions[section.questions.length - 1] 
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

exports.addImageQuestion = async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: "Vui lòng upload ảnh" })
        }

        const { text, answers, correctAnswers } = req.body
        const section = req.section

        const uploadResult = await cloudinary.uploader.upload(
            req.files.image.tempFilePath || req.files.image.data,
            { folder: "questions" }
        )

        const parsedAnswers = typeof answers === "string" ? JSON.parse(answers) : answers

        const newQuestion = {
            text,
            answers: parsedAnswers,
            correctAnswers,
            imageUrl: uploadResult.secure_url,
            imageId: uploadResult.public_id,
            isQuestionImage: true
        }

        section.questions.push(newQuestion)
        await req.exam.save()

        res.status(201).json({ message: "Thêm câu hỏi thành công" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

exports.getQuestion = async (req, res) => {
    try {
        res.status(200).json({ question: req.question })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

exports.getAllQuestion = async (req, res) => {
    try {
        res.status(200).json({ questions: req.section.questions })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

exports.addImageForQuestion = async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: "Vui lòng upload ảnh" })
        }

        const question = req.question

        const uploadResult = await cloudinary.uploader.upload(
            req.files.image.tempFilePath || req.files.image.data,
            { folder: "questions" }
        )

        question.isQuestionImage = true
        question.imageUrl = uploadResult.secure_url
        question.imageId = uploadResult.public_id

        await req.exam.save()

        res.status(200).json({ 
            message: "Thêm thành công", 
            image: uploadResult.secure_url 
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

exports.updateImageForQuestion = async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: "Vui lòng upload ảnh" })
        }

        const question = req.question

        if (question.imageId) {
            await cloudinary.uploader.destroy(question.imageId)
        }

        const uploadResult = await cloudinary.uploader.upload(
            req.files.image.tempFilePath || req.files.image.data,
            { folder: "questions" }
        )

        question.isQuestionImage = true
        question.imageUrl = uploadResult.secure_url
        question.imageId = uploadResult.public_id

        await req.exam.save()

        res.status(200).json({ message: "Thay đổi thành công" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

exports.deleteImageFromQuestion = async (req, res) => {
    try {
        const question = req.question

        if (question.imageId) {
            await cloudinary.uploader.destroy(question.imageId)
        }

        question.isQuestionImage = false
        question.imageUrl = ""
        question.imageId = ""

        await req.exam.save()

        res.status(200).json({ message: "Xóa thành công" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

exports.updateQuestion = async (req, res) => {
    try {
        const { text, answers, correctAnswers } = req.body
        const question = req.question

        if (text) question.text = text
        if (answers) question.answers = answers
        if (correctAnswers) question.correctAnswers = correctAnswers

        await req.exam.save()
        res.status(200).json({ message: "Cập nhật thành công", question })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

exports.deleteQuestion = async (req, res) => {
    try {
        const section = req.section
        const question = req.question

        if (question.imageId) {
            await cloudinary.uploader.destroy(question.imageId)
        }

        section.questions.pull(question._id)
        await req.exam.save()

        res.status(200).json({ message: "Câu hỏi được xóa thành công" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}
