const User = require('../models/Auth') // model tên là User
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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