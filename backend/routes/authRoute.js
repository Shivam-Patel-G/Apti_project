const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Student = require('../models/student');
require('dotenv').config();

const router = express.Router();

// Register a student
router.post('/register/student', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const studentExists = await Student.findOne({ email });
    if (studentExists) return res.status(400).json({ message: 'Student already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({ name, email, password: hashedPassword });
    await newStudent.save();

    const token = jwt.sign({ id: newStudent._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ result : newStudent,token:token});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register an admin
router.post('/register/admin', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ result : newAdmin,token:token});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login for both admin and student
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    let user;
    if (role === 'admin') {
      user = await Admin.findOne({ email });
    } else if (role === 'student') {
      user = await Student.findOne({ email });
    }

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
