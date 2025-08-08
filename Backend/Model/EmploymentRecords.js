import mongoose from 'mongoose';

const EmploymentRecordSchema = new mongoose.Schema({
  designation: {
    type: String,
    required: true,
  },
  employer: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date, // Sequelize's DATEONLY maps to Date in Mongoose
    required: true,
  },
  endDate: {
    type: Date, // optional field
    default: null,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
  collection: 'employment_records',
});

const EmploymentRecord = mongoose.model('EmploymentRecord', EmploymentRecordSchema);

module.exports = EmploymentRecord;