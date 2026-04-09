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

// get complaint by id (student can fetch own complaint; admin/warden/accountant can fetch any complaint)
router.get(
  "/:id",
  authMiddleware,
  complaintController.getComplaintById
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

// admin / warden / accountant view all complaints
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "warden", "accountant"),
  complaintController.getAllComplaints
);

// admin / warden / accountant update complaint status or assignment
router.put(
  "/admin/:id",
  authMiddleware,
  roleMiddleware("admin", "warden", "accountant"),
  complaintController.updateComplaintStatus
);

module.exports = router;