// import express from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const router = express.Router();

// router.post('/login', async (req, res) => {
//   const { svvId, password } = req.body;

//   try {
//     const user = await User.findOne({ where: { svvId } });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user.id, svvId: user.svvId },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     return res.json({ token, user: { svvId: user.svvId }, roles: user.roles });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });

// export default router;

import express from 'express';
import { login } from '../controllers/authController.js'; // ✅ import this

const router = express.Router();

router.post('/login', login); // ✅ use the controller

export default router;
