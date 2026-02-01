import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  templateName: { type: String, required: true },
  templateText: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Template', templateSchema);
