const User = require('../models/Auth')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
const crypto = require('crypto');

exports.getAllUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const maxLimit = 100
        const limit = Math.min(parseInt(req.query.limit) || 10, maxLimit)
        const skip = (page - 1) * limit

        const [users, totalUsers] = await Promise.all([
            User.find().sort({ createdAt: -1 }).skip(skip).limit(limit).select('-password'),
            User.countDocuments()
        ])

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
            users
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getAdmin = async (req, res) => {
    const role = "admin"
    try {
        const admin = await User.find({ role })
        res.json(admin)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}
exports.profile = async (req, res) => {
    const id = req.user.id
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' })
        }
        res.json({ name: user.name, email: user.email, role: user.role })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.updateName = async (req, res) => {
    const name = req.body.name
    const id = req.user.id
    try {
        if (!name) {
            return res.status(400).json({ message: "Tên không được trống" })
        }
        await User.findByIdAndUpdate(id, { name: name }, { new: true })
        res.status(200).json({ message: 'Thay đổi tên người dùng thành công' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const password = req.body.password
        const oldPassword = req.body.oldPassword
        const id = req.user.id
        if (!password) {
            return res.status(400).json({ message: "Mật khẩu không được trống" })
        }
        const user = await User.findById(id)
        if (!user) {
            return res.status(400).json({ message: "Tài khoản không tồn tại" })
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
        res.status(200).json({ message: 'Thay đổi mật khẩu thành công' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId)
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' })
        }
        res.status(200).json({ message: "Xóa thành công" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
exports.updateRole = async (req, res) => {
    try {
        const id = req.params.id
        const role = "admin"
        const user = await User.findByIdAndUpdate(id, { role: role }, { new: true })
        res.status(200).json({ message: "Thay đổi quyền thành công" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email không tồn tại.' });
        }

        const token = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = token;
        user.resetPasswordExpire = Date.now() + 3600000; // Token hết hạn sau 1 giờ
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `${process.env.FRONT_END_URL}/reset/password/${token}`;
        const mailOptions = {
            to: user.email,
            from: 'khanhhangcn@gmail.com',
            subject: 'Đặt lại mật khẩu',
            text: `Nhấn vào link này để đặt lại mật khẩu của bạn: ${resetUrl}`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Kiểm tra email của bạn để đặt lại mật khẩu.' });
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}
exports.resetPassword = async (req, res) => {
    const { token, password } = req.body
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        })
        if (!user) return res.status(404).json({ message: 'Token không hợp lệ hoặc đã hết hạn' })
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        res.status(200).json({ message: "Thay đổi mật khẩu thành công" })
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}