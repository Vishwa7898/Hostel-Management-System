const Notice = require('../models/Notice');

// Create a Notice
exports.createNotice = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newNotice = new Notice({
      title,
      description,
      // Use req.user.name or role if available, otherwise default
      author: req.user ? req.user.role : "Admin" 
    });
    const savedNotice = await newNotice.save();
    res.status(201).json(savedNotice);
  } catch (error) {
    res.status(500).json({ message: "Error creating notice", error: error.message });
  }
};

// Get all Notices
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notices", error: error.message });
  }
};

// Update a Notice
exports.updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const updatedNotice = await Notice.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }
    );
    if (!updatedNotice) return res.status(404).json({ message: "Notice not found" });
    res.status(200).json(updatedNotice);
  } catch (error) {
    res.status(500).json({ message: "Error updating notice", error: error.message });
  }
};

// Delete a Notice
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotice = await Notice.findByIdAndDelete(id);
    if (!deletedNotice) return res.status(404).json({ message: "Notice not found" });
    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notice", error: error.message });
  }
};
