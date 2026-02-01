import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String }, // Optional - set after OTP verification
  role: { type: String, enum: ['admin', 'business', 'free'], default: 'free' },
  isVerified: { type: Boolean, default: false },
  isOtpVerified: { type: Boolean, default: false }, // Track if initial OTP is verified
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  senderIDs: [{ type: String }],
  otp: { type: String },
  otpExpiry: { type: Date },
  pendingEmail: { type: String },
  emailChangeOtp: { type: String },
  emailChangeOtpExpiry: { type: Date },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
