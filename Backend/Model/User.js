const mongoose = require("mongoose");

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

const User = mongoose.model("User", userSchema);

module.exports = User;
