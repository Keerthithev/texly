import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendOTPEmail } from '../services/emailService.js';

// New flow: Signup with name and email only (no password initially)
export const signupPartial = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Check if email exists
    const existing = await User.findOne({ email });
    
    if (existing) {
      // If user exists and is already fully verified
      if (existing.isVerified) {
        return res.status(400).json({ message: 'Email already registered and verified. Please login.' });
      }
      
      // If user exists but not OTP verified - generate new OTP and send
      if (!existing.isOtpVerified) {
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        existing.otp = otp;
        existing.otpExpiry = otpExpiry;
        await existing.save();
        
        try {
          await sendOTPEmail(email, otp);
        } catch (emailErr) {
          console.error('Failed to send OTP email:', emailErr.message);
        }
        
        return res.status(200).json({ 
          message: 'OTP sent to your email. Please verify.',
          status: 'unverified',
          email,
          name: existing.name
        });
      }
      
      // If user is OTP verified but no password set
      if (existing.isOtpVerified && !existing.password) {
        return res.status(200).json({
          message: 'OTP verified. Please set your password.',
          status: 'pending_password',
          email,
          name: existing.name
        });
      }
    }
    
    // Create new user with only name and email (no password)
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const user = await User.create({ name, email, isVerified: false, isOtpVerified: false, otp, otpExpiry });
    
    // Send OTP email (don't fail if email fails)
    try {
      await sendOTPEmail(email, otp);
    } catch (emailErr) {
      console.error('Failed to send OTP email:', emailErr.message);
    }
    
    res.status(201).json({ 
      message: 'User created. Please check your email for verification OTP.',
      status: 'unverified',
      email,
      name
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify initial OTP (before password is set)
export const verifyInitialOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isOtpVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ 
      message: 'OTP verified successfully. Please set your password.',
      status: 'pending_password',
      email,
      name: user.name
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Complete registration by setting password
export const completeRegistration = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.isOtpVerified) {
      return res.status(400).json({ message: 'Please verify OTP first' });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.isVerified = true;
    await user.save();

    res.json({ message: 'Registration completed successfully. Please login.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Resend OTP for unverified user
export const resendInitialOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified. Please login.' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    try {
      await sendOTPEmail(email, otp);
    } catch (emailErr) {
      console.error('Failed to send OTP email:', emailErr.message);
    }

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Original signup (kept for backward compatibility)
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const user = await User.create({ name, email, password: hashed, isVerified: false, isOtpVerified: true, otp, otpExpiry });
    
    // Send OTP email (don't fail signup if email fails)
    try {
      await sendOTPEmail(email, otp);
    } catch (emailErr) {
      console.error('Failed to send OTP email:', emailErr.message);
      // User is still created, they can verify email later
    }
    
    res.status(201).json({ message: 'User created successfully. Please check your email for verification OTP.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Check if user is not fully verified yet
    if (!user.isVerified) {
      // If user has no password set, they need to complete registration
      if (!user.password) {
        if (!user.isOtpVerified) {
          // User hasn't verified OTP yet - send OTP and ask for verification
          const newOtp = crypto.randomInt(100000, 999999).toString();
          const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
          user.otp = newOtp;
          user.otpExpiry = otpExpiry;
          await user.save();
          
          try {
            await sendOTPEmail(email, newOtp);
          } catch (emailErr) {
            console.error('Failed to send OTP email:', emailErr.message);
          }
          
          return res.status(200).json({
            status: 'unverified',
            message: 'Please verify your email with OTP sent to your email.',
            email,
            name: user.name
          });
        }
        // OTP is verified but no password - prompt to set password
        return res.status(200).json({
          status: 'pending_password',
          message: 'OTP verified. Please set your password to complete registration.',
          email,
          name: user.name
        });
      }
      // User has password but not fully verified
      if (!user.isOtpVerified) {
        const newOtp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        user.otp = newOtp;
        user.otpExpiry = otpExpiry;
        await user.save();
        
        try {
          await sendOTPEmail(email, newOtp);
        } catch (emailErr) {
          console.error('Failed to send OTP email:', emailErr.message);
        }
        
        return res.status(200).json({
          status: 'unverified',
          message: 'Please verify your email with OTP sent to your email.',
          email,
          name: user.name
        });
      }
    }

    // If OTP is provided in login request (for unverified users completing verification)
    if (otp) {
      if (user.otp !== otp || user.otpExpiry < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
      user.isOtpVerified = true;
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      
      return res.status(200).json({
        status: 'pending_password',
        message: 'OTP verified. Please set your password.',
        email,
        name: user.name
      });
    }

    // Check password for fully verified users
    if (!user.password) {
      return res.status(200).json({
        status: 'pending_password',
        message: 'Please set your password to complete registration.',
        email,
        name: user.name
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If an account exists with this email, an OTP has been sent.' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    try {
      await sendOTPEmail(email, otp);
    } catch (emailErr) {
      console.error('Failed to send OTP email:', emailErr.message);
    }
    
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendOtpForEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.email === newEmail) return res.status(400).json({ message: 'New email is the same as current email' });

    const existing = await User.findOne({ email: newEmail });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.pendingEmail = newEmail;
    user.emailChangeOtp = otp;
    user.emailChangeOtpExpiry = otpExpiry;
    await user.save();

    await sendOTPEmail(newEmail, otp);
    res.json({ message: 'OTP sent to new email address' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyEmailChange = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.pendingEmail || user.emailChangeOtp !== otp || user.emailChangeOtpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.email = user.pendingEmail;
    user.pendingEmail = null;
    user.emailChangeOtp = null;
    user.emailChangeOtpExpiry = null;
    await user.save();

    res.json({ message: 'Email changed successfully', user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
