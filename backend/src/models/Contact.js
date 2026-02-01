import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  group: { type: String },
}, { timestamps: true });

export default mongoose.model('Contact', contactSchema);
