const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: String,
    isQuestionImage: { type: Boolean, default: false },
    imageUrl: String,
    imageId: String,
    answers: [String],
    correctAnswers: [String]
});

const sectionSchema = new mongoose.Schema({
    name: String,
    questions: [questionSchema]
});

const examSchema = new mongoose.Schema({
    name: String,
    slug: String,
    totalAttempts: { type: Number, default: 0 },
    examAttempt: { type: Number, default: 0 },
    timeLimit: { type: Number, default: 1 },
    isPublic: { type: Boolean, default: false },
    imageUrl: String,
    imageId: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: {
        type: Date,
        default: Date.now
    },
    sections: [sectionSchema]
});

module.exports = mongoose.model('Exam', examSchema);
