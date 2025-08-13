import Sequelize from 'sequelize';
import sequelize from '../config/db.js'; // your db connection

// Import models
import PersonalDetails from './personalDetails.js';
import AcademicQualification from './AcademicQualifications.js';
import EmploymentRecord from './EmploymentRecords.js';
import Message from './Message.js';
import User from './User.js';
import Student from './Student.js';

// Export all models and sequelize instance
export  {
  sequelize,
  Sequelize,
  PersonalDetails,
  AcademicQualification,
  EmploymentRecord,
  Message,
  User,
  Student,
};
