const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  floor: { type: Number, required: true },
  capacity: { type: Number, required: true, default: 4 },
  currentOccupants: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['available', 'occupied', 'maintenance', 'unavailable'], 
    default: 'available' 
  },
  roomType: { type: String, enum: ['single', 'double', 'triple', 'quad'], default: 'quad' },
  pricePerMonth: { type: Number, required: true },
  description: String,
  images: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);