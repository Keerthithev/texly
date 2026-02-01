import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signupPartial, verifyInitialOtp, completeRegistration, resendInitialOtp } from '../services/auth';

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

const validateForm = (name, email) => {
  const errors = {};
  if (!name.trim()) {
    errors.name = 'Name is required';
  }
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Invalid email format';
  }
  return errors;
};

const validateOtp = (otp) => /^\d{6}$/.test(otp);

const validatePasswordForm = (password, confirmPassword) => {
  const errors = {};
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
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const navigate = useNavigate();

  // Step 1: Submit name and email
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(name, email);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const result = await signupPartial(name, email);
      if (result.status === 'unverified') {
        setStep(2);
        toast.info('OTP sent to your email. Please verify.');
      } else if (result.status === 'pending_password') {
        setStep(3);
        toast.info('OTP verified. Please set your password.');
      }
    } catch (err) {
      if (err.response?.data?.message?.includes('already registered')) {
        setErrors({ general: err.response.data.message });
      } else {
        setErrors({ general: err.response?.data?.message || 'Signup failed' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleStep2Submit = async (e) => {
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
      const result = await verifyInitialOtp(email, otp);
      if (result.status === 'pending_password') {
        setStep(3);
        setOtp('');
        toast.success('OTP verified! Please set your password.');
      }
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'OTP verification failed' });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set password
  const handleStep3Submit = async (e) => {
    e.preventDefault();
    const validationErrors = validatePasswordForm(password, confirmPassword);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await completeRegistration(email, password);
      toast.success('Registration completed successfully!');
      navigate('/login');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setResendingOtp(true);
    try {
      await resendInitialOtp(email);
      toast.success('OTP resent to your email');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to resend OTP' });
    } finally {
      setResendingOtp(false);
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
              {step === 1 && 'Create Your Account'}
              {step === 2 && 'Verify Your Email'}
              {step === 3 && 'Set Your Password'}
              <br />
              {step === 1 && 'ඔබේ ගිණුම නිර්මාණය කරන්න'}
              {step === 2 && 'ඔබේ ඊමේල් තහවුරු කරන්න'}
              {step === 3 && 'ඔබේ මුරපදය තෝරන්න'}
            </h1>
            {/* Progress Steps */}
            <div className="flex justify-center items-center mt-4 gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'}`}>1</div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'}`}>2</div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'}`}>3</div>
            </div>
          </div>

          <form onSubmit={step === 1 ? handleStep1Submit : step === 2 ? handleStep2Submit : handleStep3Submit} className="bg-white p-8 rounded-lg shadow-lg">
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errors.general}
              </div>
            )}

            {/* Step 1: Name and Email */}
            {step === 1 && (
              <>
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
              </>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <>
                <div className="mb-4">
                  <label className="block text-muted mb-2">
                    Name / නම
                  </label>
                  <input
                    type="text"
                    value={name}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-muted mb-2">
                    Email / ඊමේල්
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-muted mb-2">
                    OTP / OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    required
                  />
                  {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                </div>

                <div className="mb-4 text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendingOtp}
                    className="text-sm text-primary hover:text-secondary font-semibold disabled:opacity-50"
                  >
                    {resendingOtp ? 'Sending...' : 'Resend OTP'}
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Password */}
            {step === 3 && (
              <>
                <div className="mb-4">
                  <label className="block text-muted mb-2">
                    Name / නම
                  </label>
                  <input
                    type="text"
                    value={name}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-muted mb-2">
                    Email / ඊමේල්
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100"
                  />
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
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-secondary font-semibold transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                step === 1 ? 'Signing Up...' : step === 2 ? 'Verifying...' : 'Completing...'
              ) : (
                <>
                  {step === 1 && 'Sign Up  / ලියාපදිංචි වන්න'}
                  {step === 2 && 'Verify OTP / OTP තහවුරු කරන්න'}
                  {step === 3 && 'Complete Registration / ලියාපදිංචිය අවසන් කරන්න'}
                </>
              )}
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

