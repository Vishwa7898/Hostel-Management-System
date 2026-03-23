const mongoose = require('mongoose');

const AllocationSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  checkInDate: { type: Date, required: true },
  duration: { type: String, required: true }, 
  allocatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Allocation', AllocationSchema);