const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const complaintController = require("../controllers/complaintController");

// student create complaint
router.post(
  "/",
  authMiddleware,
  roleMiddleware("student"),
  complaintController.createComplaint
);

// student view own complaints
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("student"),
  complaintController.getStudentComplaints
);

// student update own complaint
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("student"),
  complaintController.updateComplaint
);

// student delete own complaint
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("student"),
  complaintController.deleteComplaint
);

// admin view all complaints
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  complaintController.getAllComplaints
);

// admin update complaint
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  complaintController.updateComplaintStatus
);

module.exports = router;