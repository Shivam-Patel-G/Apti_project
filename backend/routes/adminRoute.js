const express = require('express');
const Question = require('../models/question');
const Test = require('../models/test');
const Student = require('../models/student');
const Result = require('../models/result')
const router = express.Router();

// Add a new question
router.post('/questions', async (req, res) => {
  try {
    const { questionText, options, correctAnswer, difficultyLevel, category } = req.body;

    // Create a new question with all fields including category
    const question = new Question({ questionText, options, correctAnswer, difficultyLevel, category });

    await question.save();
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/getAllQuestions', async (req, res) => {
  try {
    const { difficultyLevel, category } = req.query;

    let filter = {};

    if (difficultyLevel) {
      filter.difficultyLevel = difficultyLevel;
    }
    if (category) {
      filter.category = category;
    }

    const questions = await Question.find(filter);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Create a test with category
router.post('/tests', async (req, res) => {
  try {
    const { testName, questionIds,creator } = req.body; // Destructure category

    // Create a new test including category
    const test = new Test({ testName, questions: questionIds, creator });

    await test.save(); // Save test to database

    res.json(test); // Return created test
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.post('/tests/assign', async (req, res) => {
  try {
    const { testId, studentIds, assignAll } = req.body;
    
    let students;
    if (assignAll) {
      students = await Student.find(); // Find all students if 'assignAll' is true
    } else {
      students = await Student.find({ _id: { $in: studentIds } }); // Find specific students by their IDs
    }

    const test = await Test.findById(testId);
    
    students.forEach(async (student) => {
      student.assignedTests.push(testId);
      await student.save();
    });

    test.assignedStudents = students.map(student => student._id);
    await test.save();

    res.json({ message: 'Test assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/getTestsOfAdmin', async (req, res) => {
  const { creator } = req.query; // Get the admin ID from query parameters
  try {
    const tests = await Test.find({ creator }) // Find tests created by the specified admin
      .populate('questions'); // Populate the questions field for more detail
    res.json(tests); // Return the list of tests
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tests' });
  }
});

// In your backend route file (e.g., routes.js)
router.get('/student-results/:adminId', async (req, res) => {
  const { adminId } = req.params; // Get admin ID from the query

  try {
    // Find tests created by the admin
    const tests = await Test.find({ creator: adminId }).populate('questions');

    // Find results for the tests created by the admin
    const results = await Result.find({ test: { $in: tests.map(test => test._id) } })
      .populate('student') // Populate student details if needed
      .populate('test');   // Populate test details if needed

    res.json(results);
  } catch (error) {
    console.error('Error fetching student results:', error);
    res.status(500).json({ message: 'Error fetching student results' });
  }
});
router.get('/student-responses/test/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    const results = await Result.find({ test: testId })
      .populate('student', 'name email') // Populate student name and email
      .populate('test', 'testName'); // Optional: Populate test name

    res.json(results);
  } catch (error) {
    console.error('Error fetching student responses:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
