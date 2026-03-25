const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  room: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room', 
    required: true 
  },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date }, // null if ongoing
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'rejected', 'cancelled'], 
    default: 'pending' 
  },
  totalAmount: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'paid', 'partial'], 
    default: 'unpaid' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);