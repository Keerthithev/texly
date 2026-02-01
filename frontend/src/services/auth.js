import api from './api';

export const login = async (email, password, otp = null) => {
  const res = await api.post('/api/auth/login', { email, password, otp });
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
  }
  return res.data;
};

export const signupPartial = async (name, email) => {
  const res = await api.post('/api/auth/signup-partial', { name, email });
  return res.data;
};

export const verifyInitialOtp = async (email, otp) => {
  const res = await api.post('/api/auth/verify-initial-otp', { email, otp });
  return res.data;
};

export const completeRegistration = async (email, password) => {
  const res = await api.post('/api/auth/complete-registration', { email, password });
  return res.data;
};

export const resendInitialOtp = async (email) => {
  const res = await api.post('/api/auth/resend-initial-otp', { email });
  return res.data;
};

export const signup = async (name, email, password) => {
  await api.post('/api/auth/signup', { name, email, password });
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getProfile = async () => {
  const res = await api.get('/api/users/me');
  return res.data;
};

export const forgotPassword = async (email) => {
  await api.post('/api/auth/forgot-password', { email });
};

export const resetPassword = async (email, otp, newPassword) => {
  await api.post('/api/auth/reset-password', { email, otp, newPassword });
};

export const verifyEmail = async (email, otp) => {
  await api.post('/api/auth/verify-email', { email, otp });
};

export const updateProfile = async (userData) => {
  const res = await api.put('/api/users/me', userData);
  return res.data;
};

export const sendOtpForEmailChange = async (newEmail) => {
  await api.post('/api/auth/send-otp-email-change', { newEmail });
};

export const verifyEmailChange = async (otp) => {
  const res = await api.post('/api/auth/verify-email-change', { otp });
  return res.data;
};
