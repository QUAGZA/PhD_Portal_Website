import express from 'express';
import sequelize from './config/db.js';
import routes from './routes/index.js';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { Message } from './models/index.js'; // after syncing models

dotenv.config({ path: path.resolve(process.cwd(), 'server', 'config', '.env') });

// Create upload dir if not exist
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server for socket.io
const server = http.createServer(app);

// Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust to match your frontend URL if needed
    methods: ['GET', 'POST']
  }
});

// WebSocket logic
io.on('connection', async (socket) => {
  console.log('User connected:', socket.id);

  // Send all previous messages to the newly connected client
  const history = await Message.findAll({ order: [['createdAt', 'ASC']] });
  socket.emit('chatHistory', history);

  // Listen for new messages
  socket.on('chatMessage', async (msg) => {
    const saved = await Message.create({
      sender: msg.sender || 'Anonymous',
      message: msg.message,
      senderId: msg.senderId, // Store sender's socket ID
    });

    // Broadcast saved message to all clients
    socket.broadcast.emit("chatMessage", saved);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
  
app.use(cors());
app.use(express.json());
app.use('/api', routes);
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
