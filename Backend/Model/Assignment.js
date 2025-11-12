const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date, required: true },
    attachments: [
      {
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Assignment is visible to all students of the guide who created it
    // We store guide's department for broader queries if needed
    department: {
      type: String,
      index: true,
    },
    // Visible to specific students (if empty, visible to all students of the guide)
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
  },
  { timestamps: true },
);

// Indexes for better query performance
AssignmentSchema.index({ createdBy: 1, status: 1 });
AssignmentSchema.index({ deadline: 1 });
AssignmentSchema.index({ department: 1 });

// Static method to get assignments for a student
AssignmentSchema.statics.getAssignmentsForStudent = async function (
  studentId,
  guideId
) {
  return this.find({
    createdBy: guideId,
    status: "active",
    $or: [
      { assignedTo: { $size: 0 } }, // No specific assignment, visible to all
      { assignedTo: studentId }, // Specifically assigned to this student
    ],
  })
    .populate("createdBy", "personalDetails email")
    .sort({ deadline: 1 });
};

// Static method to get assignments created by guide
AssignmentSchema.statics.getAssignmentsByGuide = function (guideId) {
  return this.find({ createdBy: guideId })
    .populate("createdBy", "personalDetails email")
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model("Assignment", AssignmentSchema);
