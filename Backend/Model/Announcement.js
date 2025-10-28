const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["general", "important", "urgent", "event", "deadline"],
      default: "general",
    },
    targetAudience: {
      type: [String],
      enum: ["Student", "Guide", "FacultyCoordinator", "Admin", "All"],
      default: ["All"],
    },
    department: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    expiryDate: {
      type: Date,
    },
    attachments: [
      {
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Index for efficient querying
AnnouncementSchema.index({ createdAt: -1 });
AnnouncementSchema.index({ targetAudience: 1 });
AnnouncementSchema.index({ department: 1 });
AnnouncementSchema.index({ isActive: 1 });

module.exports = mongoose.model("Announcement", AnnouncementSchema);
