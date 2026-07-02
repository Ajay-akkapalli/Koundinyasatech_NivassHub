// ─── Mobile / OTP Mock Data ───────────────────────────────────────────────────
// Matches API contract from NivassHub API docs v1.0
// TODO: Remove once backend is live and USE_MOCK_API = false.

import { MOCK_DELAY_MS } from './config';

function mockDelay(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  data?: { mobileNumber: string; otpExpiry: number };
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: { userExists: boolean; registrationToken: string };
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

// ── POST /auth/send-otp ───────────────────────────────────────────────────────
export async function mockSendOtp(mobileNumber: string): Promise<SendOtpResponse> {
  await mockDelay();
  console.log('[MOCK] OTP for', mobileNumber, ': 1234');
  return {
    success: true,
    message: 'OTP sent successfully',
    data: { mobileNumber, otpExpiry: 120 },
  };
}

// ── POST /auth/verify-otp ─────────────────────────────────────────────────────
// Always returns userExists: false so it goes to Create Profile
// Change to true to simulate existing user → goes to Home
export async function mockVerifyOtp(
  mobileNumber: string,
  otp: string,
): Promise<VerifyOtpResponse> {
  await mockDelay();
  if (otp !== '1234') {
    return { success: false, message: 'Invalid OTP' };
  }
  return {
    success: true,
    message: 'OTP verified successfully',
    data: {
      userExists: false,
      registrationToken: `mock_reg_token_${mobileNumber}`,
    },
  };
}

// ── POST /auth/resend-otp ─────────────────────────────────────────────────────
export async function mockResendOtp(): Promise<ResendOtpResponse> {
  await mockDelay();
  return { success: true, message: 'OTP resent successfully' };
}
