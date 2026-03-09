const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    regNumber: { type: String, required: true, trim: true },
    studentName: { type: String, required: true, trim: true },
    hostelRoom: { type: String, required: true, trim: true },
    mealTime: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner'],
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'served', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

