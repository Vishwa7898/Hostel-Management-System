const express = require('express');
const router = express.Router();
const { 
  getAvailableRooms, addRoom, getAllRooms, updateRoom, 
  createBooking, updateBookingStatus, getMyBookings 
} = require('../controllers/roomController');
const auth = require('../middleware/authMiddleware'); // JWT middleware

// Student routes
router.get('/available', auth, getAvailableRooms);
router.post('/book', auth, createBooking);
router.get('/mybookings', auth, getMyBookings);

// Admin routes
router.get('/all', auth, getAllRooms);           // Admin only
router.post('/add', auth, addRoom);              // Admin only
router.put('/:id', auth, updateRoom);            // Admin only (edit/maintenance)
router.put('/booking/:id/status', auth, updateBookingStatus); // Admin only

module.exports = router;