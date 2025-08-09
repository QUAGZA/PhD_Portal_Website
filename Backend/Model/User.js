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
      railwayStation: { type: String },
      residentialAddress: [{ type: String }],
      permanentAddress: [{ type: String }],
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
    employmentDetails: {
      designation: { type: String },
      organization: { type: String },
      duration: { type: String },
    },

    programDetails: {
      rollNumber: { type: String },
      department: { type: String },
      admissionYear: { type: String },
      semester: { type: String },
      guideName: { type: String },
      guideEmail: { type: String },
      status: { type: String },
      domain: { type: String },
      topic: { type: String },
      researchDescription: { type: String },
      bonds: { type: String },
      scholarship: { type: String },
    },

    role: {
      type: String,
      enum: ["Student", "Guide", "Admin"],
      default: "Student",
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
