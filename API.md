# Quizento API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Sử dụng JWT token trong header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication API

### POST /auth/register
Đăng ký tài khoản người dùng mới.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "student"
  }
}
```

---

### POST /auth/login
Đăng nhập người dùng.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "student"
  }
}
```

---

### POST /auth/admin/login
Đăng nhập admin.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "admin"
  }
}
```

---

### POST /auth/forgot-password
Gửi email quên mật khẩu.

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "message": "Password reset link sent to email"
}
```

---

### PUT /auth/reset-password
Đặt lại mật khẩu.

**Request Body:**
```json
{
  "resetToken": "string",
  "newPassword": "string"
}
```

**Response:**
```json
{
  "message": "Password reset successful"
}
```

---

### GET /auth/admin
Lấy thông tin admin. (Cần đăng nhập)

**Response:**
```json
{
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "admin"
  }
}
```

---

## 2. User API

### GET /users/profile
Lấy thông tin profile người dùng hiện tại.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "student",
    "createdAt": "date"
  }
}
```

---

### PUT /users/password
Đổi mật khẩu người dùng.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

**Response:**
```json
{
  "message": "Password updated successfully"
}
```

---

### PUT /users/name
Đổi tên người dùng.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string"
}
```

**Response:**
```json
{
  "message": "Name updated successfully"
}
```

---

### GET /users
Lấy danh sách tất cả người dùng. (Admin only)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "users": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "student"
    }
  ]
}
```

---

### PUT /users/:id/role
Cập nhật role người dùng. (Admin only)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "role": "student" | "admin"
}
```

**Response:**
```json
{
  "message": "Role updated successfully"
}
```

---

### DELETE /users/:id
Xóa người dùng. (Admin only)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

## 3. Exam API

### GET /exams
Lấy danh sách tất cả bài thi công khai.

**Query Parameters:**
- `page` (optional): Số trang
- `limit` (optional): Số lượng mỗi trang

**Response:**
```json
{
  "exams": [
    {
      "_id": "string",
      "name": "string",
      "slug": "string",
      "isPublic": true,
      "imageUrl": "string",
      "createdAt": "date"
    }
  ]
}
```

---

### GET /exams/search
Tìm kiếm bài thi.

**Query Parameters:**
- `q`: Từ khóa tìm kiếm

**Response:**
```json
{
  "exams": [...]
}
```

---

### GET /exams/:id
Lấy chi tiết một bài thi.

**Response:**
```json
{
  "exam": {
    "_id": "string",
    "name": "string",
    "slug": "string",
    "totalAttempts": 0,
    "examAttempt": 0,
    "timeLimit": 1,
    "isPublic": true,
    "sections": [
      {
        "_id": "string",
        "name": "string",
        "questions": [...]
      }
    ]
  }
}
```

---

### GET /exams/user/list
Lấy danh sách bài thi của người dùng đang đăng nhập.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "exams": [...]
}
```

---

### GET /exams/user/search
Tìm kiếm bài thi của người dùng.

**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**
- `q`: Từ khóa tìm kiếm

**Response:**
```json
{
  "exams": [...]
}
```

---

### POST /exams
Tạo bài thi mới.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string",
  "timeLimit": 1,
  "isPublic": false,
  "imageUrl": "string"
}
```

**Response:**
```json
{
  "message": "Exam created successfully",
  "exam": {
    "_id": "string",
    "name": "string"
  }
}
```

---

### PUT /exams/:examId
Cập nhật bài thi.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string",
  "timeLimit": 1,
  "isPublic": false,
  "imageUrl": "string"
}
```

**Response:**
```json
{
  "message": "Exam updated successfully"
}
```

---

### DELETE /exams/:examId
Xóa bài thi.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Exam deleted successfully"
}
```

---

## 4. Section API

### GET /exams/:examId/sections
Lấy danh sách section của một bài thi.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "sections": [
    {
      "_id": "string",
      "name": "string",
      "questions": [...]
    }
  ]
}
```

---

### POST /exams/:examId/sections
Tạo section mới.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string"
}
```

**Response:**
```json
{
  "message": "Section created successfully",
  "section": {
    "_id": "string",
    "name": "string"
  }
}
```

---

### PUT /exams/:examId/sections/:sectionId
Cập nhật section.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string"
}
```

**Response:**
```json
{
  "message": "Section updated successfully"
}
```

---

### DELETE /exams/:examId/sections/:sectionId
Xóa section.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Section deleted successfully"
}
```

---

## 5. Question API

### GET /exams/:examId/sections/:sectionId/questions
Lấy tất cả câu hỏi trong section.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "questions": [
    {
      "_id": "string",
      "text": "string",
      "isQuestionImage": false,
      "imageUrl": "string",
      "answers": ["string"],
      "correctAnswers": ["string"]
    }
  ]
}
```

---

### GET /exams/:examId/sections/:sectionId/questions/search
Tìm kiếm câu hỏi.

**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**
- `q`: Từ khóa tìm kiếm

**Response:**
```json
{
  "questions": [...]
}
```

---

### GET /exams/:examId/sections/:sectionId/questions/:questionId
Lấy chi tiết một câu hỏi.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "question": {
    "_id": "string",
    "text": "string",
    "isQuestionImage": false,
    "imageUrl": "string",
    "answers": ["string"],
    "correctAnswers": ["string"]
  }
}
```

---

### POST /exams/:examId/sections/:sectionId/questions
Tạo câu hỏi mới.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "text": "string",
  "answers": ["answer1", "answer2", "answer3", "answer4"],
  "correctAnswers": ["answer1"]
}
```

**Response:**
```json
{
  "message": "Question created successfully",
  "question": {
    "_id": "string",
    "text": "string"
  }
}
```

---

### POST /exams/:examId/sections/:sectionId/questions/image
Tạo câu hỏi có ảnh.

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `text`: string
- `answers`: string (JSON array)
- `correctAnswers`: string (JSON array)
- `image`: file

**Response:**
```json
{
  "message": "Question created successfully",
  "question": {
    "_id": "string",
    "text": "string",
    "isQuestionImage": true,
    "imageUrl": "string"
  }
}
```

---

### PUT /exams/:examId/sections/:sectionId/questions/:questionId/add-image
Thêm ảnh vào câu hỏi.

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `image`: file

**Response:**
```json
{
  "message": "Image added successfully"
}
```

---

### PUT /exams/:examId/sections/:sectionId/questions/:questionId/change-image
Thay đổi ảnh câu hỏi.

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `image`: file

**Response:**
```json
{
  "message": "Image updated successfully"
}
```

---

### DELETE /exams/:examId/sections/:sectionId/questions/:questionId/delete-image
Xóa ảnh khỏi câu hỏi.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Image deleted successfully"
}
```

---

### PUT /exams/:examId/sections/:sectionId/questions/:questionId
Cập nhật câu hỏi.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "text": "string",
  "answers": ["answer1", "answer2", "answer3", "answer4"],
  "correctAnswers": ["answer1"]
}
```

**Response:**
```json
{
  "message": "Question updated successfully"
}
```

---

### DELETE /exams/:examId/sections/:sectionId/questions/:questionId
Xóa câu hỏi.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Question deleted successfully"
}
```

---

## 6. Score API

### GET /exams/:examId/score
Lấy điểm của người dùng trong bài thi.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "scores": [
    {
      "_id": "string",
      "userId": "string",
      "score": 100,
      "totalQuestions": 10,
      "correctAnswers": 10,
      "createdAt": "date"
    }
  ]
}
```

---

### POST /exams/:examId/score
Nộp bài thi và tính điểm.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": "string",
      "answer": "string"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Score calculated successfully",
  "score": {
    "score": 80,
    "totalQuestions": 10,
    "correctAnswers": 8
  }
}
```

---

## Models

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String,
  role: 'student' | 'admin',
  createdAt: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date
}
```

### Exam Schema
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  totalAttempts: Number,
  examAttempt: Number,
  timeLimit: Number (hours),
  isPublic: Boolean,
  imageUrl: String,
  imageId: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  sections: [{
    _id: ObjectId,
    name: String,
    questions: [{
      _id: ObjectId,
      text: String,
      isQuestionImage: Boolean,
      imageUrl: String,
      imageId: String,
      answers: [String],
      correctAnswers: [String]
    }]
  }]
}
```

### ExamScore Schema
```javascript
{
  _id: ObjectId,
  examId: ObjectId (ref: Exam),
  userId: ObjectId (ref: User),
  score: Number,
  totalQuestions: Number,
  correctAnswers: Number,
  createdAt: Date
}
```

---

## Error Responses

```json
{
  "error": "Error message"
}
```

```json
{
  "message": "Unauthorized"
}
```

```json
{
  "message": "Not found"
}
```