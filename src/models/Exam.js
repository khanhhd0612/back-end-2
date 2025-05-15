const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: String,
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
    isPublic: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: {
        type: Date,
        default: Date.now
    },
    sections: [sectionSchema]
});

module.exports = mongoose.model('Exam', examSchema);
