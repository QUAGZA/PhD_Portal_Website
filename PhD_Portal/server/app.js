// import express from 'express';
// import cors from 'cors';
// import { connectDB } from './config/db.js';
// import sequelize from './config/db.js';
// import routes from './routes/index.js'; // All route files combined

// // Import all models to sync them
// import './models/index.js';

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api', routes);

// // Root route
// app.get('/', (req, res) => {
//   res.send('🎓 PhD Portal Backend is running!');
// });

// // Start server + connect DB
// app.listen(PORT, async () => {
//   await connectDB();
//   await sequelize.sync(); // { force: true } to reset tables
//   console.log(`🚀 Server started on http://localhost:${PORT}`);
// });
