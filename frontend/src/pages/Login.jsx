import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../services/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setError(data.errors.map(e => e.msg).join('. '));
      } else {
        setError(data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center p-12">
        <div className="text-center text-white">
          <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" alt="Welcome Back" className="mx-auto mb-8 rounded-lg shadow-lg" />
          <h2 className="text-3xl font-bold mb-4">
            Welcome Back
            <br />
            නැවත සාදරයෙන් පිළිගනිමු
          </h2>
          <p className="text-lg">
            Sign in to access your Texly dashboard.
            <br />
            ඔබේ Texly උපකරණ පුවරුවට ප්‍රවේශ වීම සඳහා පුරන්න.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold text-primary">Texly</Link>
            <h1 className="text-2xl font-semibold text-primary mt-4">
              Login to Your Account
              <br />
              ඔබේ ගිණුමට පුරන්න
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-muted mb-2">
                Email / ඊමේල්
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: '' })); }}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your email"
                required
              />
              {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-muted mb-2">
                Password / මුරපදය
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: '' })); }}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              {fieldErrors.password && <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-secondary disabled:opacity-50 font-semibold transition-colors mb-4"
            >
              {loading ? 'Logging in...' : 'Login'}
              <br />
              {loading ? 'පුරනවා...' : 'පුරන්න'}
            </button>

            <div className="text-center">
              <Link to="/forgot-password" className="text-sm text-primary hover:text-secondary">
                Forgot password?
                <br />
                මුරපදය අමතක වුණාද?
              </Link>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-muted">
              Don't have an account?
              <br />
              ගිණුමක් නැද්ද?
              <Link to="/signup" className="text-primary hover:text-secondary font-semibold ml-1">
                Sign up
                <br />
                ලියාපදිංචි වන්න
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
