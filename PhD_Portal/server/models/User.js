import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcrypt";

const User = sequelize.define("User", {
  svvId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roles: {
    type: DataTypes.ARRAY(DataTypes.STRING), // ['student', 'guide', 'faculty']
    allowNull: false,
    defaultValue: ["student"], // or []
  },
});

// ✅ Hash password before saving or updating
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// ✅ Add instance method to compare password
User.prototype.checkPassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

export default User;
