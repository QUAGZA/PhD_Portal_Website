import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const login = async (req, res) => {
  const { svvId, password } = req.body;

  const user = await User.findOne({ where: { svvId } });
  if (!user || !(await user.checkPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // if (!user.roles.includes(role)) {
  //   return res.status(403).json({ message: "Role not recognized for this user" });
  // }


  const token = jwt.sign(
    {
      id: user.id,
      svvId: user.svvId,
      roles: user.roles,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.json({ token });
};
