import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  plan: { type: String, enum: ['free', 'payg', 'premium'], default: 'free' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  credits: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Subscription', subscriptionSchema);
