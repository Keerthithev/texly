import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword, resetPassword } from '../services/auth';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePasswordStrength = (password) => {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
};

const validateOtp = (otp) => /^\d{6}$/.test(otp);

export default function ForgotPassword() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      validationErrors.email = 'Invalid email format';
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success('OTP sent successfully! Please check your email.');
      setStep('otp');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to send OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!otp.trim()) {
      validationErrors.otp = 'OTP is required';
    } else if (!validateOtp(otp)) {
      validationErrors.otp = 'OTP must be 6 digits';
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      // Verify OTP by calling resetPassword with empty newPassword or create a separate verify endpoint
      // For now, we'll assume OTP verification is part of resetPassword
      setOtpVerified(true);
      setStep('reset');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Invalid OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!newPassword) {
      validationErrors.newPassword = 'New password is required';
    } else if (!validatePasswordStrength(newPassword)) {
      validationErrors.newPassword = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }
    if (!confirmPassword) {
      validationErrors.confirmPassword = 'Confirm password is required';
    } else if (newPassword !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      console.log('Attempting to reset password for email:', email);
      const result = await resetPassword(email, otp, newPassword);
      console.log('Password reset API call succeeded:', result);
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      console.log('Password reset API call failed:', err);
      console.log('Error response:', err.response?.data);
      setErrors({ general: err.response?.data?.message || 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center p-12">
        <div className="text-center text-white">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" alt="Reset Password" className="mx-auto mb-8 rounded-lg shadow-lg" />
          <h2 className="text-3xl font-bold mb-4">
            Reset Your Password
            <br />
            ඔබේ මුරපදය නැවත සකසන්න
          </h2>
          <p className="text-lg">
            Enter your email to receive an OTP and reset your password.
            <br />
            ඔබේ මුරපදය නැවත සැකසීම සඳහා ඊමේල් ආදානය කර OTP ලබා ගන්න.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold text-primary">Texly</Link>
            <h1 className="text-2xl font-semibold text-primary mt-4">
              {step === 'email' ? 'Forgot Password' : step === 'otp' ? 'Verify OTP' : 'Reset Password'}
              <br />
              {step === 'email' ? 'මුරපදය අමතක වී ඇත' : step === 'otp' ? 'OTP තහවුරු කරන්න' : 'මුරපදය නැවත සකසන්න'}
            </h1>
          </div>

          <form onSubmit={step === 'email' ? handleEmailSubmit : step === 'otp' ? handleOtpSubmit : handleResetSubmit} className="bg-white p-8 rounded-lg shadow-lg">
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errors.general}
              </div>
            )}

            {step === 'email' ? (
              <>
                <div className="mb-4">
                  <label className="block text-muted mb-2">
                    Email / ඊමේල්
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-secondary font-semibold transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                  <br />
                  {loading ? 'OTP යවමින්...' : 'OTP යවන්න'}
                </button>
              </>
            ) : step === 'otp' ? (
              <>
                <div className="mb-6">
                  <label className="block text-muted mb-2">
                    OTP / OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter 6-digit OTP"
                    required
                  />
                  {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-secondary font-semibold transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                  <br />
                  {loading ? 'තහවුරු කරමින්...' : 'OTP තහවුරු කරන්න'}
                </button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-muted mb-2">
                    New Password / නව මුරපදය
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter new password"
                    required
                  />
                  {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                </div>

                <div className="mb-6">
                  <label className="block text-muted mb-2">
                    Confirm New Password / නව මුරපදය තහවුරු කරන්න
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Confirm new password"
                    required
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-secondary font-semibold transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                  <br />
                  {loading ? 'නැවත සකසමින්...' : 'මුරපදය නැවත සකසන්න'}
                </button>
              </>
            )}
          </form>

          <div className="text-center mt-6">
            <p className="text-muted">
              Remember your password?
              <br />
              ඔබේ මුරපදය මතකද?
              <Link to="/login" className="text-primary hover:text-secondary font-semibold ml-1">
                Login
                <br />
                පුරන්න
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}