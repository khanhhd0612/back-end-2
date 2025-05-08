const Exam = require("../models/Exam")

exports.getSection = async (req, res) => {
    const examId = req.params.examId
    const { id, role } = req.user
    try {
        const exam = await Exam.findById(examId).populate('createdBy', 'name')
        if (!exam) return res.status(404).json({ message: 'Không tìm thấy bài thi' })
        if (id != exam.createdBy.id && role != "admin") return res.status(404).json({ message: 'Bạn không có quyền đối với bài thi của người khác' })

        const section = exam.sections

        res.status(200).json({ section: section, exam: exam.name })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
exports.addSection = async (req, res) => {
    const examId = req.params.examId
    const { name } = req.body
    const { id, role } = req.user
    try {
        const exam = await Exam.findById(examId)
        if (!exam) return res.status(404).json({ message: 'Không tìm thấy bài thi' })
        if (id != exam.createdBy.id && role != "admin") return res.status(404).json({ message: 'Bạn không có quyền đối với bài thi của người khác' })

        newSection = {
            name: name,
            questions: []
        }
        exam.sections.push(newSection)
        await exam.save()
        res.status(200).json({ message: "Thêm phần thi thành công" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.updateSection = async (req, res) => {
    const examId = req.params.examId;
    const sectionId = req.params.sectionId;
    const { id, role } = req.user;
    const name = req.body.name
    try {
        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ message: 'Không tìm thấy bài thi' });
        if (id != exam.createdBy.id && role != "admin")
            return res.status(404).json({ message: 'Bạn không có quyền xóa phần thi này' });
        const section = exam.sections.id(sectionId);
        if (!section) return res.status(404).json({ message: "Không tìm thấy phần thi" });
        if (!name)  return res.status(404).json({ message: "Tên phần thi không được để trống" }) 

        section.name = name
        await exam.save()
        res.status(200).json({ message: "Đổi tên  phần thi thành công" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.deleteSection = async (req, res) => {
    const examId = req.params.examId;
    const sectionId = req.params.sectionId;
    const { id, role } = req.user;

    try {
        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ message: 'Không tìm thấy bài thi' });
        if (id != exam.createdBy.id && role != "admin")
            return res.status(404).json({ message: 'Bạn không có quyền xóa phần thi này' });

        exam.sections = exam.sections.filter(
            (section) => section._id.toString() !== sectionId
        );

        await exam.save();
        res.status(200).json({ message: "Xóa phần thi thành công" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}