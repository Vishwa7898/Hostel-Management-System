const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});
const upload = multer({ storage: storage });

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

router.post('/register', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'nicFront', maxCount: 1 },
  { name: 'nicBack', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, email, password, role, address, city, studentPhone, guardianName, contactNumber } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    const profilePhoto = req.files?.['profilePhoto'] ? `/uploads/${req.files['profilePhoto'][0].filename}` : '';
    const nicFront = req.files?.['nicFront'] ? `/uploads/${req.files['nicFront'][0].filename}` : '';
    const nicBack = req.files?.['nicBack'] ? `/uploads/${req.files['nicBack'][0].filename}` : '';

    let studentId = '';
    if (!role || role === 'Student') {
      const studentCount = await User.countDocuments({ role: 'Student' });
      studentId = `Id${studentCount + 1}`;
    }

    const user = await User.create({ 
      name, email, password, role: role || 'Student',
      address, city, studentPhone, guardianName, contactNumber,
      profilePhoto, nicFront, nicBack, studentId
    });

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role, studentId: user.studentId,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      if (role && role !== 'Student' && user.role === 'Student') {
         return res.status(401).json({ message: 'Not authorized for this role' });
      }
      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role, studentId: user.studentId,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
