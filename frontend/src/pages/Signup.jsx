import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signup } from '../services/auth';

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

const validateForm = (name, email, password, confirmPassword) => {
  const errors = {};
  if (!name.trim()) {
    errors.name = 'Name is required';
  }
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Invalid email format';
  }
  if (!password) {
    errors.password = 'Password is required';
  } else if (!validatePasswordStrength(password)) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
  }
  if (!confirmPassword) {
    errors.confirmPassword = 'Confirm password is required';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  return errors;
};

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(name, email, password, confirmPassword);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await signup(name, email, password);
      showToast('Account created successfully!');
      navigate('/verify-email', { state: { email, successMessage: 'Account created successfully! Please check your email for verification code.' } });
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Signup failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center p-12">
        <div className="text-center text-white">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" alt="Join Texly" className="mx-auto mb-8 rounded-lg shadow-lg" />
          <h2 className="text-3xl font-bold mb-4">
            Join Texly Today
            <br />
            අදම Texly වෙත සම්බන්ධ වන්න
          </h2>
          <p className="text-lg">
            Start sending SMS with our powerful platform.
            <br />
            අපගේ ශක්තිමත් වේදිකාව සමඟ SMS යැවීම ආරම්භ කරන්න.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold text-primary">Texly</Link>
            <h1 className="text-2xl font-semibold text-primary mt-4">
              Create Your Account
              <br />
              ඔබේ ගිණුම නිර්මාණය කරන්න
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errors.general}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-muted mb-2">
                Full Name / සම්පූර්ණ නම
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

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

            <div className="mb-4">
              <label className="block text-muted mb-2">
                Password / මුරපදය
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Create a password"
                required
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-muted mb-2">
                Confirm Password / මුරපදය තහවුරු කරන්න
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Confirm your password"
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-secondary font-semibold transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
              <br />
              {loading ? 'ලියාපදිංචි වෙමින්...' : 'ලියාපදිංචි වන්න'}
            </button>

            <div className="text-center">
              <p className="text-sm text-muted">
                By signing up, you agree to our Terms of Service and Privacy Policy.
                <br />
                ලියාපදිංචි වීමෙන්, ඔබ අපගේ සේවා නියමයන් සහ පුද්ගලිකත්ව ප්‍රතිපත්තියට එකඟ වේ.
              </p>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-muted">
              Already have an account?
              <br />
              ගිණුමක් තියෙනවද?
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
