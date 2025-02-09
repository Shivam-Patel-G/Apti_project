const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  assignedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', // Assuming Admin schema exists
    required: true
  }
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
