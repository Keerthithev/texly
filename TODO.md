# TODO: Authentication Flow Enhancement

## Backend Changes ✅ COMPLETED

### 1. Update User Model
- [x] Add `isOtpVerified` field (default: false) to track if initial OTP is verified

### 2. Update authController.js
- [x] Modify `signupPartial` to accept only name and email (no password)
- [x] Add `verifyInitialOtp` endpoint - verify OTP, set `isOtpVerified: true`
- [x] Add `completeRegistration` endpoint - set password after OTP verified
- [x] Add `resendInitialOtp` endpoint - resend OTP for unverified users
- [x] Modify `login` to handle different states:
  - Unverified user → return { status: 'unverified', email }
  - OTP verified but no password → return { status: 'pending_password' }
  - Fully verified → allow login

### 3. Update authRoutes.js
- [x] Add new route for `signup-partial`
- [x] Add new route for `verify-initial-otp`
- [x] Add new route for `complete-registration`
- [x] Add new route for `resend-initial-otp`

## Frontend Changes ✅ COMPLETED

### 1. Update auth.js services
- [x] Add `signupPartial` - signup with name and email only
- [x] Add `verifyInitialOtp` - verify initial OTP
- [x] Add `completeRegistration` - set password after OTP verified
- [x] Add `resendInitialOtp` - resend OTP for unverified users

### 2. Update Signup.jsx
- [x] Step 1: Name + Email → submit → go to OTP verification
- [x] Step 2: Enter OTP → verify → go to set password
- [x] Step 3: Password + Confirm Password → complete registration → go to login

### 3. Update Login.jsx
- [x] If user is unverified → show OTP input
- [x] After OTP verified → show password input
- [x] Add Resend OTP button
- [x] Add Back button to return to login form

## Testing Required
- [ ] Test signup flow with email verification
- [ ] Test login with unverified email
- [ ] Test resend OTP functionality
- [ ] Test complete registration flow
- [ ] Test old users (with isOtpVerified=true) can still login

