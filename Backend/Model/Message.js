import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  senderId: {
    type: String,
    required: true,
  },
}, {
  timestamps: false,
  collection: 'messages',
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;