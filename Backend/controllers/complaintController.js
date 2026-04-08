const Complaint = require("../models/Complaint");
const User = require("../models/user");

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
      student: req.user._id,
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
    const complaints = await Complaint.find({ student: req.user._id }).sort({ createdAt: -1 });
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

exports.updateComplaint = async (req, res) => {
  try {
    const { anonymous, category, title, description, roomNumber, locationType } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Check if complaint belongs to the student
    if (complaint.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own complaints" });
    }

    // Check if status is still Pending
    if (complaint.status !== "Pending") {
      return res.status(400).json({ message: "Cannot edit complaint that has been reviewed" });
    }

    if (!category || !title || !description || !locationType) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    if (locationType === "room" && !roomNumber) {
      return res.status(400).json({ message: "Room number is required for room-related complaints" });
    }

    complaint.anonymous = anonymous;
    complaint.displayName = anonymous ? "Anonymous" : req.user.name;
    complaint.category = category;
    complaint.title = title;
    complaint.description = description;
    complaint.roomNumber = locationType === "room" ? roomNumber : "";
    complaint.locationType = locationType;

    await complaint.save();

    res.json({ message: "Complaint updated successfully", complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Check if complaint belongs to the student
    if (complaint.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own complaints" });
    }

    // Check if status is still Pending
    if (complaint.status !== "Pending") {
      return res.status(400).json({ message: "Cannot delete complaint that has been reviewed" });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};