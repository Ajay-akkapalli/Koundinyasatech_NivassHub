// ─── Auth Mock Data ───────────────────────────────────────────────────────────
// These mocks exactly match the API contract defined in the NivassHub API docs.
// TODO: Remove this file once the real backend is live and USE_MOCK_API = false.

import type {
  RegisterFormData,
  LoginFormData,
  RegisterApiResponse,
  AuthResponse,
  OtpResponse,
} from '@features/auth/types';

import { MOCK_DELAY_MS } from './config';

// Simulates a realistic async network delay
export function mockDelay(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
}

// ── In-memory user store (persists for the session only) ─────────────────────
const mockUsers: Array<RegisterFormData & { userId: string }> = [];
let userCounter = 100001;

// ── Register Mock ─────────────────────────────────────────────────────────────
// Matches: POST /api/v1/auth/register
// Response: { success, message, data: { userId, accessToken, refreshToken } }
export async function mockRegister(data: RegisterFormData): Promise<RegisterApiResponse> {
  await mockDelay();

  const emailExists = mockUsers.some(u => u.email === data.email);
  if (emailExists) {
    return {
      success: false,
      message: 'Email already exists',
      data: { userId: '', accessToken: '', refreshToken: '' },
    };
  }

  const userId = `USR${userCounter++}`;
  mockUsers.push({ ...data, userId });

  return {
    success: true,
    message: 'Registration successful',
    data: {
      userId,
      accessToken: `mock_access_token_${userId}`,
      refreshToken: `mock_refresh_token_${userId}`,
    },
  };
}

// ── Login Mock ────────────────────────────────────────────────────────────────
// Matches: POST /api/v1/auth/login
// Response: { user, token }
export async function mockLogin(data: LoginFormData): Promise<AuthResponse> {
  await mockDelay();

  const user = mockUsers.find(u => u.email === data.email);

  // Allow login even if not registered in this session (first-time Expo test)
  const resolvedUser = user ?? {
    userId: 'USR100001',
    fullName: 'Demo User',
    email: data.email,
    mobileNumber: '9876543210',
    address: 'Hyderabad',
    password: data.password,
    confirmPassword: data.password,
  };

  if (user && user.password !== data.password) {
    throw new Error('Invalid email or password.');
  }

  return {
    user: {
      userId: resolvedUser.userId,
      fullName: resolvedUser.fullName,
      email: resolvedUser.email,
      mobileNumber: resolvedUser.mobileNumber,
      address: resolvedUser.address,
      role: 'resident',
    },
    token: {
      accessToken: `mock_access_token_${resolvedUser.userId}`,
      refreshToken: `mock_refresh_token_${resolvedUser.userId}`,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    },
  };
}

// ── Forgot Password Mock ──────────────────────────────────────────────────────
// Matches: POST /api/v1/auth/forgot-password
export async function mockForgotPassword(): Promise<OtpResponse> {
  await mockDelay();
  return { success: true, message: 'OTP sent successfully' };
}

// ── Verify OTP Mock ───────────────────────────────────────────────────────────
// Matches: POST /api/v1/auth/verify-otp
export async function mockVerifyOtp(): Promise<OtpResponse> {
  await mockDelay();
  return { success: true, message: 'OTP verified successfully', resetToken: 'mock_reset_token_abc123' };
}

// ── Reset Password Mock ───────────────────────────────────────────────────────
// Matches: POST /api/v1/auth/reset-password
export async function mockResetPassword(): Promise<{ success: boolean }> {
  await mockDelay();
  return { success: true };
}
