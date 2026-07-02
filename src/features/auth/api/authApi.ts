import axios from 'axios';
import { post } from '@services/api';
import { USE_MOCK_API } from '@/mocks/config';
import {
  mockRegister,
  mockLogin,
  mockForgotPassword,
  mockVerifyOtp,
  mockResetPassword,
} from '@/mocks/authMocks';
import type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  OtpFormData,
  ResetPasswordFormData,
  AuthResponse,
  RegisterApiResponse,
  OtpResponse,
  User,
} from '../types';

const BASE = '/auth';

// ─── Response mapper ──────────────────────────────────────────────────────────
function mapRegisterResponse(
  raw: RegisterApiResponse,
  formData: RegisterFormData,
): AuthResponse {
  const user: User = {
    userId: raw.data.userId,
    fullName: formData.fullName,
    email: formData.email,
    mobileNumber: formData.mobileNumber,
    address: formData.address,
    role: 'resident',
  };
  const token = {
    accessToken: raw.data.accessToken,
    refreshToken: raw.data.refreshToken,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };
  return { user, token };
}

// ─── Error resolver ───────────────────────────────────────────────────────────
function resolveErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const serverMsg = error.response?.data?.message;

    console.error('[API] URL     :', `${error.config?.baseURL}${error.config?.url}`);
    console.error('[API] Payload :', error.config?.data);
    console.error('[API] Status  :', status ?? 'NO RESPONSE');
    console.error('[API] Body    :', JSON.stringify(error.response?.data));
    console.error('[API] Code    :', error.code);

    if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return 'Cannot reach the server. Make sure the backend is running.';
    }
    if (serverMsg) return serverMsg;
    if (status === 400) return 'Invalid request. Please check your details.';
    if (status === 401) return 'Unauthorized. Please log in again.';
    if (status === 403) return 'Access denied.';
    if (status === 404) return 'API endpoint not found.';
    if (status === 409) return 'Account already exists with this email or mobile.';
    if (status && status >= 500) return 'Server error. Please try again later.';
  }
  return 'Something went wrong. Please try again.';
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
// TODO: Set USE_MOCK_API = false in src/mocks/config.ts once backend is live.

export const authApi = {

  async register(data: RegisterFormData): Promise<AuthResponse> {
    // ── MOCK ──────────────────────────────────────────────────────
    if (USE_MOCK_API) {
      console.log('[MOCK] POST /auth/register', data.email);
      const raw = await mockRegister(data);
      if (!raw.success) throw new Error(raw.message);
      return mapRegisterResponse(raw, data);
    }
    // ── REAL API ──────────────────────────────────────────────────
    try {
      console.log('[API] POST /auth/register');
      const raw = await post<RegisterApiResponse>(`${BASE}/register`, {
        mobileNumber: data.mobileNumber,
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        address: data.address,
      });
      if (!raw.success) throw new Error(raw.message || 'Registration failed.');
      return mapRegisterResponse(raw, data);
    } catch (error: unknown) {
      if (error instanceof Error && !axios.isAxiosError(error)) throw error;
      throw new Error(resolveErrorMessage(error));
    }
  },

  async login(data: LoginFormData): Promise<AuthResponse> {
    // ── MOCK ──────────────────────────────────────────────────────
    if (USE_MOCK_API) {
      console.log('[MOCK] POST /auth/login', data.email);
      return mockLogin(data);
    }
    // ── REAL API ──────────────────────────────────────────────────
    try {
      console.log('[API] POST /auth/login');
      return await post<AuthResponse>(`${BASE}/login`, data);
    } catch (error: unknown) {
      throw new Error(resolveErrorMessage(error));
    }
  },

  async forgotPassword(data: ForgotPasswordFormData): Promise<OtpResponse> {
    // ── MOCK ──────────────────────────────────────────────────────
    if (USE_MOCK_API) {
      console.log('[MOCK] POST /auth/forgot-password', data.email);
      return mockForgotPassword();
    }
    // ── REAL API ──────────────────────────────────────────────────
    try {
      return await post<OtpResponse>(`${BASE}/forgot-password`, data);
    } catch (error: unknown) {
      throw new Error(resolveErrorMessage(error));
    }
  },

  async verifyOtp(data: OtpFormData): Promise<OtpResponse> {
    // ── MOCK ──────────────────────────────────────────────────────
    if (USE_MOCK_API) {
      console.log('[MOCK] POST /auth/verify-otp');
      return mockVerifyOtp();
    }
    // ── REAL API ──────────────────────────────────────────────────
    try {
      return await post<OtpResponse>(`${BASE}/verify-otp`, data);
    } catch (error: unknown) {
      throw new Error(resolveErrorMessage(error));
    }
  },

  async resetPassword(data: ResetPasswordFormData): Promise<{ success: boolean }> {
    // ── MOCK ──────────────────────────────────────────────────────
    if (USE_MOCK_API) {
      console.log('[MOCK] POST /auth/reset-password');
      return mockResetPassword();
    }
    // ── REAL API ──────────────────────────────────────────────────
    try {
      return await post<{ success: boolean }>(`${BASE}/reset-password`, data);
    } catch (error: unknown) {
      throw new Error(resolveErrorMessage(error));
    }
  },

  refreshToken: (refreshToken: string) =>
    post<AuthResponse>(`${BASE}/refresh`, { refreshToken }),

  logout: () =>
    post<{ success: boolean }>(`${BASE}/logout`),
};
