const express = require('express');
const router = express.Router();
const Allocation = require('../models/Allocation'); 
const Room = require('../models/Room');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

// --- POST: Assign Student ---
router.post('/assign', protect, async (req, res) => {
  try {
    const { roomId, studentId, checkInDate, duration } = req.body;

    const room = await Room.findById(roomId);
    const student = await Student.findById(studentId);

    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Capacity Check - Frontend එකේ පාවිච්චි කරන field එකම මෙතනත් බලයි
    if ((room.occupiedCount || 0) >= room.totalBeds) {
      return res.status(400).json({ message: "Room is already full" });
    }

    // 1. Save Allocation
    const newAllocation = new Allocation({
      room: roomId,
      student: studentId,
      checkInDate,
      duration
    });
    await newAllocation.save();

    // 2. Update Room (Frontend Table එකට අවශ්‍ය field names මෙන්න)
    room.occupiedCount = (room.occupiedCount || 0) + 1;
    room.assignedStudentName = student.name; 
    
    // Status update
    room.status = room.occupiedCount >= room.totalBeds ? 'Full' : 'Available';

    await room.save();

    res.status(201).json({ message: "Student assigned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- POST: Unassign Student ---
router.post('/unassign', protect, async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findById(roomId);

    if (!room) return res.status(404).json({ message: "Room not found" });

    // Capacity අඩු කිරීම සහ නම ඉවත් කිරීම
    room.occupiedCount = Math.max(0, (room.occupiedCount || 1) - 1);
    room.assignedStudentName = "None"; 
    room.status = room.occupiedCount < room.totalBeds ? 'Available' : 'Full';

    await room.save();
    res.json({ message: "Student removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// --- POST: Unassign Student ---
router.post('/unassign', protect, async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findById(roomId);

    if (!room) return res.status(404).json({ message: "Room not found" });

    // 1. අදාළ කාමරයට තිබෙන Allocation record එක delete කිරීම
    await Allocation.deleteMany({ room: roomId });

    // 2. Room එකේ දත්ත Update කිරීම
    // දැනට ඉන්න ගණනින් 1ක් අඩු කරයි, නමුත් එය 0 ට වඩා අඩු වීමට ඉඩ නොදෙයි
    room.occupiedCount = Math.max(0, (room.occupiedCount || 1) - 1);
    
    // කාමරය සම්පූර්ණයෙන්ම හිස් නම් නම "None" කරයි
    if (room.occupiedCount === 0) {
      room.assignedStudentName = "None";
    }

    // Status එක ආපසු Available කරයි
    room.status = room.occupiedCount < room.totalBeds ? 'Available' : 'Full';

    await room.save();
    res.json({ message: "Student removed successfully", occupiedCount: room.occupiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;