exports.getSection = async (req, res) => {
    try {
        const exam = req.exam
        const section = exam.sections
        res.status(200).json({ section, exam: exam.name })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.addSection = async (req, res) => {
    try {
        const exam = req.exam
        const { name } = req.body

        if (!name) return res.status(400).json({ message: "Tên phần thi không được để trống" })

        const newSection = { name, questions: [] }
        exam.sections.push(newSection)

        await exam.save()
        res.status(200).json({ message: "Thêm phần thi thành công" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.updateSection = async (req, res) => {
    try {
        const exam = req.exam
        const { sectionId } = req.params
        const { name } = req.body

        const section = exam.sections.id(sectionId)
        if (!section) return res.status(404).json({ message: "Không tìm thấy phần thi" })
        if (!name) return res.status(400).json({ message: "Tên phần thi không được để trống" })

        section.name = name
        await exam.save()

        res.status(200).json({ message: "Đổi tên phần thi thành công" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.deleteSection = async (req, res) => {
    try {
        const exam = req.exam
        const { sectionId } = req.params

        exam.sections = exam.sections.filter(
            (section) => section._id.toString() !== sectionId
        )

        await exam.save()
        res.status(200).json({ message: "Xóa phần thi thành công" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
