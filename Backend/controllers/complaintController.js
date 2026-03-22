const Complaint = require("../models/Complaint");
const User = require("../models/User");

exports.createComplaint = async (req, res) => {
  try {
    const { anonymous, category, title, description, roomNumber, locationType } = req.body;

    if (!category || !title || !description || !locationType) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    if (locationType === "room" && !roomNumber) {
      return res.status(400).json({ message: "Room number is required for room-related complaints" });
    }

    const complaint = await Complaint.create({
      student: req.user.id,
      anonymous,
      displayName: anonymous ? "Anonymous" : req.user.name,
      category,
      title,
      description,
      roomNumber: locationType === "room" ? roomNumber : "",
      locationType,
      status: "Pending"
    });

    res.status(201).json({ message: "Complaint submitted successfully", complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, assignedWorker } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (assignedWorker !== undefined) {
      complaint.assignedWorker = assignedWorker;
    }

    if (status) {
      complaint.status = status;
    }

    await complaint.save();

    res.json({ message: "Complaint updated successfully", complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};