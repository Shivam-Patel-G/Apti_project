const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    options:[String],
    correctAnswer: String,
    category: {
        type: String,
        required:true
    },
    difficultyLevel: {
        type: String,
        enum: ['easy','moderate','hard'],
        required: true
    }
})

const Question = mongoose.model('Question',questionSchema)

module.exports = Question;