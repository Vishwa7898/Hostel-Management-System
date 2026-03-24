const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const protect = require('../middleware/authMiddleware');

// Get all notices (Student and Admin)
router.get('/', protect, noticeController.getAllNotices);

// Create notice (Admin only)
router.post('/', protect, noticeController.createNotice);

// Update notice (Admin only)
router.put('/:id', protect, noticeController.updateNotice);

// Delete notice (Admin only)
router.delete('/:id', protect, noticeController.deleteNotice);

module.exports = router;
