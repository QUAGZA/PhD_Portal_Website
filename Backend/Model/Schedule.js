const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    duration: {
      type: String, // e.g., "2 hours", "30 minutes"
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Meeting", "Defense", "Review", "Committee", "Seminar", "Workshop", "Conference", "Other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed", "Cancelled", "Postponed"],
      default: "Scheduled",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
        },
        role: {
          type: String,
          enum: ["Student", "Guide", "FacultyCoordinator", "Admin", "External"],
        },
        attendance: {
          type: String,
          enum: ["Invited", "Confirmed", "Declined", "Maybe", "Present", "Absent"],
          default: "Invited",
        },
        isRequired: {
          type: Boolean,
          default: false,
        },
      },
    ],
    agenda: [
      {
        item: {
          type: String,
          required: true,
        },
        duration: {
          type: String, // e.g., "15 minutes"
        },
        presenter: {
          type: String,
        },
      },
    ],
    documents: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    reminders: [
      {
        time: {
          type: Date,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        sent: {
          type: Boolean,
          default: false,
        },
      },
    ],
    recurring: {
      isRecurring: {
        type: Boolean,
        default: false,
      },
      frequency: {
        type: String,
        enum: ["Daily", "Weekly", "Monthly", "Yearly"],
      },
      endDate: {
        type: Date,
      },
      occurrences: {
        type: Number, // Number of times to repeat
      },
    },
    notes: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    department: {
      type: String,
      trim: true,
    },
    institute: {
      type: String,
      trim: true,
    },
    meetingLink: {
      type: String,
      trim: true,
    },
    requirements: {
      equipment: [String],
      catering: {
        required: {
          type: Boolean,
          default: false,
        },
        details: String,
      },
      specialAccess: String,
    },
  },
  {
    timestamps: true,
    collection: "schedules",
  }
);

// Indexes for better query performance
scheduleSchema.index({ date: 1, startTime: 1 });
scheduleSchema.index({ organizer: 1 });
scheduleSchema.index({ "attendees.userId": 1 });
scheduleSchema.index({ type: 1, status: 1 });
scheduleSchema.index({ department: 1 });
scheduleSchema.index({ createdAt: -1 });

// Virtual for formatted date
scheduleSchema.virtual("formattedDate").get(function () {
  return this.date.toLocaleDateString();
});

// Virtual for duration calculation
scheduleSchema.virtual("calculatedDuration").get(function () {
  if (this.startTime && this.endTime) {
    const start = new Date(`1970-01-01T${this.startTime}`);
    const end = new Date(`1970-01-01T${this.endTime}`);
    const diffMs = end - start;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHrs > 0) {
      return diffMins > 0 ? `${diffHrs}h ${diffMins}m` : `${diffHrs}h`;
    }
    return `${diffMins}m`;
  }
  return this.duration || "Unknown";
});

// Instance method to check if event is upcoming
scheduleSchema.methods.isUpcoming = function () {
  const now = new Date();
  const eventDateTime = new Date(`${this.date.toDateString()} ${this.startTime}`);
  return eventDateTime > now;
};

// Instance method to check if event is today
scheduleSchema.methods.isToday = function () {
  const today = new Date();
  const eventDate = new Date(this.date);
  return eventDate.toDateString() === today.toDateString();
};

// Instance method to add attendee
scheduleSchema.methods.addAttendee = function (attendeeData) {
  const existingAttendee = this.attendees.find(
    (attendee) => attendee.userId && attendee.userId.toString() === attendeeData.userId
  );

  if (!existingAttendee) {
    this.attendees.push(attendeeData);
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to update attendee status
scheduleSchema.methods.updateAttendeeStatus = function (userId, attendance) {
  const attendee = this.attendees.find(
    (attendee) => attendee.userId && attendee.userId.toString() === userId
  );

  if (attendee) {
    attendee.attendance = attendance;
    return this.save();
  }
  return Promise.resolve(this);
};

// Static method to get events for a user
scheduleSchema.statics.getEventsForUser = function (userId, startDate, endDate) {
  return this.find({
    $or: [
      { organizer: userId },
      { "attendees.userId": userId }
    ],
    date: {
      $gte: startDate || new Date(),
      $lte: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    },
    status: { $ne: "Cancelled" }
  }).populate("organizer", "personalDetails email")
    .populate("attendees.userId", "personalDetails email")
    .sort({ date: 1, startTime: 1 });
};

// Static method to get upcoming events
scheduleSchema.statics.getUpcomingEvents = function (limit = 10) {
  const now = new Date();
  return this.find({
    date: { $gte: now },
    status: { $in: ["Scheduled", "In Progress"] }
  }).populate("organizer", "personalDetails email")
    .sort({ date: 1, startTime: 1 })
    .limit(limit);
};

// Pre-save middleware to calculate duration if not provided
scheduleSchema.pre("save", function (next) {
  if (!this.duration && this.startTime && this.endTime) {
    this.duration = this.calculatedDuration;
  }
  next();
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
