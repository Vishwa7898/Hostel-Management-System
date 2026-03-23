const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Student Registration Route - FIXED
router.post('/register', protect, async (req, res) => {
  try {
    // 1. මෙතනට 'email' එකතු කරන්න (Frontend එකෙන් එවන email එක මෙතනින් ගන්නවා)
    const { studentId, name, email, age, faculty, year } = req.body;

    // 2. අලුත් Student object එකටත් 'email' එකතු කරන්න
    const newStudent = new Student({ 
      studentId, 
      name, 
      email, // අනිවාර්යයෙන්ම මෙය තිබිය යුතුයි
      age, 
      faculty, 
      year 
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    // Validation fail වුණොත් මෙතනින් error එක බලාගන්න පුළුවන්
    res.status(400).json({ message: err.message });
  }
});

// 1. DELETE Student
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. UPDATE (Edit) Student
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;