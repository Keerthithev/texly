import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { verifyEmail } from '../services/auth';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateOtp = (otp) => /^\d{6}$/.test(otp);

export default function VerifyEmail() {
  const location = useLocation();
  const { email: initialEmail, successMessage } = location.state || {};
  const [email, setEmail] = useState(initialEmail || '');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      validationErrors.email = 'Invalid email format';
    }
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
      await verifyEmail(email, otp);
      toast.success('Email verified successfully!');
      navigate('/login');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to verify email' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center p-12">
        <div className="text-center text-white">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" alt="Verify Email" className="mx-auto mb-8 rounded-lg shadow-lg" />
          <h2 className="text-3xl font-bold mb-4">
            Verify Your Email
            <br />
            ඔබේ ඊමේල් තහවුරු කරන්න
          </h2>
          <p className="text-lg">
            Enter your email and the OTP sent to verify your account.
            <br />
            ඔබේ ගිණුම තහවුරු කිරීම සඳහා ඊමේල් සහ OTP ආදානය කරන්න.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold text-primary">Texly</Link>
            <h1 className="text-2xl font-semibold text-primary mt-4">
              Verify Email
              <br />
              ඊමේල් තහවුරු කරන්න
            </h1>
          </div>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errors.general}
              </div>
            )}

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
              {loading ? 'Verifying...' : 'Verify Email'}
              <br />
              {loading ? 'තහවුරු කරමින්...' : 'ඊමේල් තහවුරු කරන්න'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-muted">
              Already verified?
              <br />
              දැනටමත් තහවුරු කර ඇතිද?
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