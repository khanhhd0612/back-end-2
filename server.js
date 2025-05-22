require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./src/config/database')
const routes = require('./src/routes/route')
const fileUpload = require('express-fileupload')

const app = express()
app.use(cors())
app.use(express.json())
app.use(fileUpload({
  useTempFiles: true, // Bắt buộc để upload lên Cloudinary
}))

connectDB()

app.use('/api', routes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))