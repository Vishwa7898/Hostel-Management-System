const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String },
  faculty: { type: String },
  year: { type: String },
  allocatedRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  checkInDate: { type: Date },
  duration: { type: String },
}, { timestamps: true });
module.exports = mongoose.model('Student', studentSchema);