import mongoose from 'mongoose';

const smsSchema = new mongoose.Schema({
  senderID: { type: String },
  message: { type: String, required: true },
  recipients: [{ type: String, required: true }],
  status: { type: String, enum: ['pending', 'sent', 'failed', 'scheduled'], default: 'pending' },
  scheduleTime: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('SMS', smsSchema);
