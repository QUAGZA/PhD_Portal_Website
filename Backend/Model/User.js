const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // profile: {
    //   name: { type: String, required: true },
    //   avatar: { type: String, default: "" },
    //   initials: { type: String },
    //   institution: { type: String },
    //   course: { type: String },
    //   enrollmentId: { type: String },
    //   dob: { type: String },
    //   phone: { type: String },
    //   email: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     validate: {
    //       validator: (v) => /^\S+@\S+\.\S+$/.test(v),
    //       message: (props) => `${props.value} is not a valid email!`,
    //     },
    //   },
    // },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => /^\S+@\S+\.\S+$/.test(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },

    // Password for local authentication (optional - for Google OAuth users)
    password: {
      type: String,
      select: false, // Don't return password by default in queries
    },

    // Authentication method
    authMethod: {
      type: String,
      enum: ["local", "google", "both"],
      default: "local",
    },

    personalDetails: {
      title: { type: String },
      firstName: { type: String },
      middleName: { type: String },
      lastName: { type: String },
      fatherName: { type: String },
      motherName: { type: String },
      gender: { type: String, enum: ["Male", "Female", "Other", ""] },
      maritalStatus: { type: String, default: "Unmarried" },
      aadhar: {
        type: String,
        validate: {
          validator: (v) => /^[0-9]{12}$/.test(v),
          message: (props) => `${props.value} is not a valid Aadhar number!`,
        },
      },
      addressLine1: { type: String },
      addressLine2: { type: String },
      district: { type: String },
      state: { type: String },
      pinCode: { type: Number },
      permanentAddressLine1: { type: String },
      permanentAddressLine2: { type: String },
      permanentDistrict: { type: String },
      permanentState: { type: String },
      permanentPinCode: { type: Number },
      contacts: {
        mobile: { type: String },
        alternateMobile: { type: String },
        primaryEmail: {
          type: String,
          validate: {
            validator: (v) => /^\S+@\S+\.\S+$/.test(v),
            message: (props) => `${props.value} is not a valid email!`,
          },
        },
        alternateEmail: {
          type: String,
          validate: {
            validator: (v) => !v || /^\S+@\S+\.\S+$/.test(v),
            message: (props) => `${props.value} is not a valid email!`,
          },
        },
      },
    },

    academicQualifications: {
      undergraduate: [
        {
          degree: { type: String },
          institute: { type: String },
          university: { type: String },
          yearOfPassing: { type: String },
        },
      ],
      postgraduate: [
        {
          degree: { type: String },
          institute: { type: String },
          university: { type: String },
          yearOfPassing: { type: String },
        },
      ],
    },
    employmentDetails: [
      {
        designation: { type: String },
        organization: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        duration: { type: String },
      },
    ],
    programDetails: {
      rollNumber: { type: String },
      department: { type: String },
      institute: { type: String },
      enrollmentYear: { type: String },
      semester: { type: String },
      // Guide assignment - using ObjectId reference for better data integrity
      guideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        validate: {
          validator: async function (value) {
            if (!value) return true; // Optional field
            const User = mongoose.model("User");
            const guide = await User.findById(value);
            return guide && guide.roles && guide.roles.includes("Guide");
          },
          message: "Referenced user must exist and have Guide role",
        },
      },
      // Legacy fields - kept for backward compatibility
      guideName: { type: String },
      guideEmail: { type: String },
      // Guide assignment status
      guideAssignmentStatus: {
        type: String,
        enum: ["Pending", "Assigned", "Changed", "Unassigned"],
        default: "Unassigned",
      },
      guideAssignmentDate: { type: Date },
      status: { type: String },
      domain: { type: String },
      topic: { type: String },
      researchDescription: { type: String },
      bonds: { type: String },
      scholarship: { type: String },
    },

    roles: {
      type: [String],
      enum: ["Student", "Guide", "FacultyCoordinator", "Admin"],
      default: ["Student"],
      validate: {
        validator: function (roles) {
          return roles.length > 0;
        },
        message: "User must have at least one role",
      },
    },

    registrationComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "users",
  },
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ roles: 1 });
userSchema.index({ "programDetails.guideId": 1 });
userSchema.index({ "programDetails.department": 1 });
userSchema.index({ "programDetails.guideAssignmentStatus": 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to get students by guide
userSchema.statics.getStudentsByGuide = function (guideId) {
  return this.find({
    "programDetails.guideId": guideId,
    roles: "Student",
  }).select("-password");
};

// Static method to get guides by department
userSchema.statics.getGuidesByDepartment = function (department) {
  return this.find({
    "programDetails.department": department,
    roles: "Guide",
  }).select("-password");
};

// Static method to get students by department
userSchema.statics.getStudentsByDepartment = function (department) {
  return this.find({
    "programDetails.department": department,
    roles: "Student",
  }).select("-password");
};

// Static method to get faculty coordinators by department
userSchema.statics.getFacultyByDepartment = function (department) {
  return this.find({
    "programDetails.department": department,
    roles: "FacultyCoordinator",
  }).select("-password");
};

// Instance method to get guide for a student
userSchema.methods.getMyGuide = async function () {
  if (!this.roles.includes("Student") || !this.programDetails?.guideId) {
    return null;
  }
  return await this.model("User")
    .findById(this.programDetails.guideId)
    .select("-password");
};

// Instance method to get faculty coordinator for a guide/student
userSchema.methods.getMyFacultyCoordinator = async function () {
  if (!this.programDetails?.department) {
    return null;
  }
  return await this.model("User")
    .findOne({
      "programDetails.department": this.programDetails.department,
      roles: "FacultyCoordinator",
    })
    .select("-password");
};

const User = mongoose.model("User", userSchema);

module.exports = User;
