const express = require('express');
const router = express.Router();
const {
  getAvailableRooms,
  addRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
  createBooking,
  updateBookingStatus,
  getMyBookings
} = require('../controllers/roomController');
const auth = require('../middleware/authMiddleware'); // JWT middleware

// Student routes
router.get('/available', auth, getAvailableRooms);
router.post('/book', auth, createBooking);
router.get('/mybookings', auth, getMyBookings);

// Admin routes — specific paths before `/:id` so they are not captured as ids
router.get('/all', auth, getAllRooms);
router.post('/add', auth, addRoom);
router.put('/booking/:id/status', auth, updateBookingStatus);
router.delete('/:id', auth, deleteRoom);
router.put('/:id', auth, updateRoom);

module.exports = router;