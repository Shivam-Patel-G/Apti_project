const express = require('express');
const Student = require('../models/student');
const Test = require('../models/test');
const Result = require('../models/result')

const router = express.Router();

// Get assigned tests for a student
router.get('/students/:id/tests', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('assignedTests');
    res.json(student.assignedTests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/tests/upcoming/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    // Find all tests where the student is assigned
    const tests = await Test.find({ assignedStudents: studentId }).populate('questions');
    
    res.status(200).json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tests' });
  }
});

router.get('/getAllStudents', async (req, res) => {
  try {
    const students = await Student.find(); // Retrieve all students from the database
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/test/:testId', async (req, res) => {
  try {
      const { testId } = req.params;
      const test = await Test.findById(testId).populate('questions');
      res.json(test);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching the test' });
  }
});

router.post('/test/submit', async (req, res) => {
  const { studentId, testId, answers } = req.body;

  try {
      // Fetch test and its questions
      const test = await Test.findById(testId).populate('questions');
      const student = await Student.findById(studentId);

      if (!test || !student) {
          return res.status(404).json({ message: 'Test or Student not found' });
      }

      // Calculate total marks and marks obtained
      let marksObtained = 0;
      const totalMarks = test.questions.length;
      const processedAnswers = [];

      for (const question of test.questions) {
          const selectedOption = answers[question._id]; // Selected answer by student
          const correct = question.correctAnswer === selectedOption; // Compare with correct answer

          if (correct) {
              marksObtained++;
          }

          processedAnswers.push({
              questionId: question._id,
              selectedOption,
              correct
          });
      }

      // Save result in database
      const result = new Result({
          student: studentId,
          test: testId,
          answers: processedAnswers,
          marksObtained,
          totalMarks,
      });

      await result.save();

      // Return the result
      res.json({ message: 'Test submitted successfully', result, marksObtained, totalMarks });
  } catch (error) {
      console.error('Error submitting test:', error.message, error.stack);
      res.status(500).json({ message: 'Error submitting test', error: error.message });
  }
});


module.exports = router;
