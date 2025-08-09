const mongoose = require("mongoose");

const currentYear = new Date().getFullYear();

const AcademicQualificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^\S+@\S+\.\S+$/.test(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    type: {
      type: String,
      enum: ["UG", "PG"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    university: {
      type: String,
      required: true,
    },
    institute: {
      type: String,
      required: true,
    },
    yearOfPassing: {
      type: Number,
      required: true,
      validate: {
        validator: (v) => Number.isInteger(v) && v >= 1960 && v <= currentYear,
        message: (props) => `${props.value} is not a valid passing year!`,
      },
    },
  },
  {
    timestamps: true,
    collection: "academic_qualifications",
  },
);

const AcademicQualification = mongoose.model(
  "AcademicQualification",
  AcademicQualificationSchema,
);

module.exports = AcademicQualification;
