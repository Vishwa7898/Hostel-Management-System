const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { protect, adminOnly } = require('../middleware/auth');

// 1. GET ALL ROOMS
router.get('/', protect, async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. POST - ADD NEW ROOM
router.post('/', async (req, res) => {
  try {
    // නව කාමරයක් එක් කරන විට ආරම්භයේදී ඉඩ ප්‍රමාණයන් නිවැරදිව සැකසීම
    const roomData = {
      ...req.body,
      occupiedBeds: 0, // ආරම්භයේදී 0 ලෙස සලකයි
      assignedStudentName: "None" // ආරම්භයේදී කිසිවෙක් නැත
    };
    const room = new Room(roomData);
    const saved = await room.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 3. PUT - UPDATE ROOM DETAILS
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    // මෙහිදී image_9a0925.png හි ඇති පරිදි සියලු දත්ත update කිරීමට ඉඩ ලබා දේ
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(updatedRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. DELETE A ROOM
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;