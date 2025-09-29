const User = require('../models/Auth') // model tên là User
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        let errors = {}
        if (!name) errors.name = ['Tên không được để trống']
        if (!email) errors.email = ['Email không được để trống']
        if (!password) errors.password = ['Mật khẩu không được để trống']
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ errors: { email: ['Email đã được sử dụng'] } })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'student'
        })

        await newUser.save()

        res.status(201).json({ message: 'Đăng ký thành công', user: newUser })

    } catch (error) {
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
exports.login = async (req, res) => {
    const { email, password } = req.body
    const privateKey = process.env.SECRET_KEY
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Thiếu email hoặc password" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Tài khoản không tồn tại" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng" })
        }
        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role },
            `${privateKey}`,
            { expiresIn: "7d" }
        )
        res.status(200).json({ message: "Đăng nhập thành công!", token })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body
    const privateKey = process.env.SECRET_KEY
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Thiếu email hoặc password" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Tài khoản không tồn tại" })
        }
        if (user.role != "admin") return res.status(404).json({ message: "Bạn không phải là admin" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng" })
        }
        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role },
            `${privateKey}`,
            { expiresIn: "7d" }
        )
        res.status(200).json({ message: "Đăng nhập thành công!", token })
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

