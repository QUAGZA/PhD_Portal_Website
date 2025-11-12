const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["submitted", "pending", "graded", "late"],
      default: "pending",
    },
    grade: { type: Number },
    comments: { type: String },
    feedback: { type: String },
    attachments: [
      {
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
      },
    ],
    submittedAt: { type: Date },
    gradedAt: { type: Date },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

// Compound index for efficient queries
SubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });
SubmissionSchema.index({ student: 1, status: 1 });
SubmissionSchema.index({ assignment: 1, status: 1 });

// Static method to get submissions for an assignment
SubmissionSchema.statics.getSubmissionsForAssignment = function (assignmentId) {
  return this.find({ assignment: assignmentId })
    .populate("student", "personalDetails email programDetails")
    .populate("gradedBy", "personalDetails email")
    .sort({ submittedAt: -1 });
};

// Static method to get submissions by student
SubmissionSchema.statics.getSubmissionsByStudent = function (studentId) {
  return this.find({ student: studentId })
    .populate("assignment", "title description deadline createdBy")
    .populate({
      path: "assignment",
      populate: {
        path: "createdBy",
        select: "personalDetails email",
      },
    })
    .sort({ submittedAt: -1 });
};

module.exports = mongoose.model("Submission", SubmissionSchema);
