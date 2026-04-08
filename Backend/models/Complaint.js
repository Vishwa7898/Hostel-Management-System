const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  anonymous: {
    type: Boolean,
    default: false
  },
  displayName: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    default: ""
  },
  locationType: {
    type: String,
    enum: ["room", "general"],
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Done"],
    default: "Pending"
  },
  assignedWorker: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);
