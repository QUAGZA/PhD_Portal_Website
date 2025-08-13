import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Student = sequelize.define("Student", {
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  enrollmentId: { type: DataTypes.STRING, allowNull: false },
  institution: { type: DataTypes.STRING },
  course: { type: DataTypes.STRING },
});

export default Student;

