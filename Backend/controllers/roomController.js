const Room = require('../models/Room');
const Booking = require('../models/Booking');

// Get all available rooms (Student view)
exports.getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'available' });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const MAX_ROOM_FLOOR = 4;
const MAX_ROOM_BEDS = 3;
const ALLOWED_ROOM_TYPES = ['single', 'double', 'triple'];

// Admin: Add new room
exports.addRoom = async (req, res) => {
  try {
    const {
      floor,
      capacity,
      roomType,
      pricePerMonth,
      roomNumber,
      currentOccupants,
      images
    } = req.body;

    if (!roomNumber || !String(roomNumber).trim()) {
      return res.status(400).json({ message: 'Room number is required.' });
    }
    if (floor == null || !Number.isFinite(Number(floor)) || floor < 1 || floor > MAX_ROOM_FLOOR) {
      return res.status(400).json({ message: `Floor must be between 1 and ${MAX_ROOM_FLOOR}.` });
    }
    if (!roomType || !ALLOWED_ROOM_TYPES.includes(roomType)) {
      return res.status(400).json({ message: 'Room type must be single, double, or triple.' });
    }
    const cap = Number(capacity);
    if (!Number.isFinite(cap) || !Number.isInteger(cap) || cap < 1 || cap > MAX_ROOM_BEDS) {
      return res.status(400).json({ message: `Total beds must be a whole number from 1 to ${MAX_ROOM_BEDS}.` });
    }
    if (pricePerMonth == null || !Number.isFinite(Number(pricePerMonth)) || Number(pricePerMonth) < 10000) {
      return res.status(400).json({ message: 'Monthly rate must be at least Rs. 10000.' });
    }
    if (!Array.isArray(images) || images.length === 0 || !String(images[0] || '').trim()) {
      return res.status(400).json({ message: 'Room image is required.' });
    }
    const occ = currentOccupants != null ? Number(currentOccupants) : 0;
    if (!Number.isFinite(occ) || !Number.isInteger(occ) || occ < 0 || occ > cap) {
      return res.status(400).json({ message: 'Occupants must be a valid count for the selected capacity.' });
    }

    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Get all rooms + bookings
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    const bookings = await Booking.find().populate('room').populate('student', 'name email');
    res.json({ rooms, bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Update room (edit / set maintenance)
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Delete room and related booking records
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    await Booking.deleteMany({ room: req.params.id });
    res.json({ message: 'Room removed', room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Student: Create booking request
exports.createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate } = req.body;
    const studentId = req.user.id; // from auth middleware

    if (!checkInDate) {
      return res.status(400).json({ message: 'Check-in date is required' });
    }

    const checkIn = new Date(checkInDate);
    if (Number.isNaN(checkIn.getTime())) {
      return res.status(400).json({ message: 'Invalid check-in date' });
    }

    const now = new Date();
    const todayStartUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const checkInStartUtc = Date.UTC(
      checkIn.getUTCFullYear(),
      checkIn.getUTCMonth(),
      checkIn.getUTCDate()
    );
    if (checkInStartUtc < todayStartUtc) {
      return res.status(400).json({ message: 'Check-in date cannot be in the past' });
    }

    const room = await Room.findById(roomId);
    if (!room || room.status !== 'available') {
      return res.status(400).json({ message: 'Room not available' });
    }

    if (room.currentOccupants >= room.capacity) {
      return res.status(400).json({ message: 'Room is full' });
    }

    const totalAmount = room.pricePerMonth; // or calculate based on period

    const booking = new Booking({
      student: studentId,
      room: roomId,
      checkInDate,
      totalAmount,
      status: 'pending'
    });

    await booking.save();

    // Optional: Update room status to occupied if you want immediate
    // room.currentOccupants += 1;
    // await room.save();

    res.status(201).json({ 
      message: 'Booking request submitted successfully!', 
      booking,
      success: true 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Confirm / Reject booking
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // confirmed / rejected
    const allowed = ['confirmed', 'rejected'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Status must be confirmed or rejected.' });
    }

    const booking = await Booking.findById(req.params.id).populate('room');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'This booking is no longer pending.' });
    }

    booking.status = status;
    await booking.save();

    if (status === 'confirmed') {
      const roomId = booking.room?._id || booking.room;
      if (!roomId) {
        return res.status(400).json({ message: 'Room no longer exists for this booking.' });
      }
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(400).json({ message: 'Room not found.' });
      }
      room.currentOccupants += 1;
      if (room.currentOccupants >= room.capacity) {
        room.status = 'occupied';
      }
      await room.save();
    }

    res.json({ message: `Booking ${status}`, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user.id })
      .populate('room')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};