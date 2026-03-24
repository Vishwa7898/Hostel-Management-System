const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  type: { type: String, required: true },
  floor: { type: Number, required: true },
  totalBeds: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  
  occupiedBeds: { type: Number, default: 0 }, 
  occupiedCount: { type: Number, default: 0 },
  assignedStudentName: { type: String, default: "None" },
  status: { type: String, default: "Available" }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);