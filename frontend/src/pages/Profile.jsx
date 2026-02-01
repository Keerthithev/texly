import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProfile, logout, updateProfile, sendOtpForEmailChange, verifyEmailChange } from '../services/auth';

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name[0].toUpperCase();
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [originalEmail, setOriginalEmail] = useState('');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const fetchProfile = async () => {
    try {
      const user = await getProfile();
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
      setOriginalEmail(user.email);
    } catch (err) {
      toast.error('Failed to load profile');
    }
  };


  const handleSave = async () => {
    setLoading(true);
    try {
      if (email !== originalEmail && !showOtpVerification) {
        // Email changed, need OTP verification
        await handleSendOtpForEmailChange();
        return;
      }

      // Update profile via API (name and phone only; email updated separately after verification)
      const updatedUser = await updateProfile({ name, phone });
      setName(updatedUser.name);
      setPhone(updatedUser.phone || '');
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setShowOtpVerification(false);
      setOtp('');
      setPendingEmail('');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtpForEmailChange = async () => {
    try {
      setLoading(true);
      await sendOtpForEmailChange(email);
      setPendingEmail(email);
      setShowOtpVerification(true);
      setOtpTimer(60);
      setCanResendOtp(false);
    } catch (err) {
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      // Verify the new email with OTP
      const res = await verifyEmailChange(otp);
      const updatedUser = res.user;

      setName(updatedUser.name);
      setEmail(updatedUser.email);
      setPhone(updatedUser.phone || '');
      setOriginalEmail(updatedUser.email);
      toast.success('Email verified and profile updated successfully!');
      setIsEditing(false);
      setShowOtpVerification(false);
      setOtp('');
      setPendingEmail('');
    } catch (err) {
      toast.error('Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOtp = () => {
    setShowOtpVerification(false);
    setOtp('');
    setPendingEmail('');
    setEmail(originalEmail);
    setOtpTimer(0);
    setCanResendOtp(false);
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      await sendOtpForEmailChange(pendingEmail);
      setOtpTimer(60);
      setCanResendOtp(false);
      setOtp('');
      toast.success('OTP resent to your new email address');
    } catch (err) {
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/dashboard" className="text-2xl font-bold text-primary">Texly</Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/dashboard" className="text-muted hover:text-primary">Dashboard</Link>
              <Link to="/profile" className="text-primary font-semibold">Profile</Link>
            </nav>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  logout();
                  toast.success('Logged out successfully!');
                  // Redirect to login after a short delay
                  setTimeout(() => window.location.href = '/login', 1000);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-8">
            <div className="flex items-center">
              <div className="w-24 h-24 rounded-full border-4 border-white mr-6 bg-primary flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(name)}
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  Your Profile
                  <br />
                  ඔබේ පැතිකඩ
                </h1>
                <p className="text-white">
                  Manage your account information
                  <br />
                  ඔබේ ගිණුම් තොරතුරු කළමනාකරණය කරන්න
                </p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-6">
                  Personal Information
                  <br />
                  පුද්ගලික තොරතුරු
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-muted mb-2">
                      Full Name / සම්පූර්ණ නම
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-lg font-medium">{name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-muted mb-2">
                      Email / ඊමේල්
                    </label>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {email !== originalEmail && (
                          <button
                            onClick={handleSendOtpForEmailChange}
                            disabled={loading || otpTimer > 0}
                            className="px-4 py-3 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50 text-sm"
                          >
                            {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Send OTP'}
                            <br />
                            {otpTimer > 0 ? `${otpTimer} තත්පරයන් තුළ නැවත යවන්න` : 'OTP යවන්න'}
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-lg font-medium">{email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-muted mb-2">
                      Phone Number / දුරකථන අංකය
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-lg font-medium">{phone}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-primary mb-6">
                  Account Settings
                  <br />
                  ගිණුම් සැකසීම්
                </h2>

                <div className="space-y-4">
                  <div className="bg-background p-4 rounded-lg">
                    <h3 className="font-semibold text-primary mb-2">
                      Subscription Plan
                      <br />
                      දායකත්ව සැලසුම
                    </h3>
                    <p className="text-muted">Premium Plan - $20/month</p>
                    <p className="text-sm text-muted">ප්‍රීමියම් සැලසුම - මාසයකට $20</p>
                  </div>

                  <div className="bg-background p-4 rounded-lg">
                    <h3 className="font-semibold text-primary mb-2">
                      SMS Sent This Month
                      <br />
                      මේ මාසයේ යවන ලද SMS
                    </h3>
                    <p className="text-muted">2,450 / 10,000</p>
                  </div>

                  <div className="bg-background p-4 rounded-lg">
                    <h3 className="font-semibold text-primary mb-2">
                      Account Status
                      <br />
                      ගිණුම් තත්ත්වය
                    </h3>
                    <p className="text-success font-medium">Active</p>
                    <p className="text-sm text-muted">සක්‍රිය</p>
                  </div>
                </div>
              </div>
            </div>

            {/* OTP Verification Modal */}
            {showOtpVerification && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                  <h3 className="text-xl font-semibold mb-4">
                    Verify New Email
                    <br />
                    නව ඊමේල් තහවුරු කරන්න
                  </h3>
                  <p className="text-muted mb-4">
                    We've sent an OTP to {pendingEmail}. Please enter it below.
                    <br />
                    අපි OTP එකක් {pendingEmail} වෙත යවා ඇත. කරුණාකර එය පහත ඇතුළත් කරන්න.
                  </p>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                  />
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted">
                      {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'OTP expired'}
                      <br />
                      {otpTimer > 0 ? `${otpTimer} තත්පරයන් තුළ නැවත යවන්න` : 'OTP කල් ඉකුත් වී ඇත'}
                    </span>
                    <button
                      onClick={handleResendOtp}
                      disabled={!canResendOtp || loading}
                      className="text-primary hover:text-secondary disabled:text-muted disabled:cursor-not-allowed text-sm font-medium"
                    >
                      Resend OTP
                      <br />
                      OTP නැවත යවන්න
                    </button>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleVerifyOtp}
                      disabled={loading || otpTimer === 0}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
                    >
                      {loading ? 'Verifying...' : 'Verify'}
                      <br />
                      {loading ? 'තහවුරු කරමින්...' : 'තහවුරු කරන්න'}
                    </button>
                    <button
                      onClick={handleCancelOtp}
                      className="flex-1 px-4 py-2 border border-gray-300 text-muted rounded-md hover:bg-gray-50"
                    >
                      Cancel
                      <br />
                      අවලංගු කරන්න
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                    <br />
                    {loading ? 'සුරකිමින්...' : 'වෙනස්කම් සුරකින්න'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 text-muted rounded-md hover:bg-gray-50"
                  >
                    Cancel
                    <br />
                    අවලංගු කරන්න
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary font-semibold"
                >
                  Edit Profile
                  <br />
                  පැතිකඩ සංස්කරණය කරන්න
                </button>
              )}
              <Link
                to="/dashboard"
                className="px-6 py-3 border border-primary text-primary rounded-md hover:bg-primary hover:text-white text-center"
              >
                Back to Dashboard
                <br />
                උපකරණ පුවරුවට ආපසු
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
