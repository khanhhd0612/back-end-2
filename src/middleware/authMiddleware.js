const jwt = require("jsonwebtoken")

exports.checkLogin = (req, res, next) => {
  let token

  if (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ')) {
    token = req.headers['authorization'].slice(7)
  } else if (req.body && req.body.token) {
    token = req.body.token
  } else if (req.params && req.params.token) {
    token = req.params.token
  }
  if (!token) {
    return res.status(401).json({ message: "Chưa đăng nhập" })
  }


  try {
    const decoded = jwt.verify(token, `${process.env.SECRET_KEY}`)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ" })
  }
}

exports.checkRole = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let token;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }
  if (!token) {
    return res.status(401).json({ message: "Chưa đăng nhập" })
  }

  try {
    const decoded = jwt.verify(token, `${process.env.SECRET_KEY}`)
    if (decoded.role !== 'admin') {
      return res.status(401).json({ message: "Bạn không có quyền làm chức năng này" })
    }
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ" })
  }
}
