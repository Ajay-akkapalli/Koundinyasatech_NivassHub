import { post } from '@services/api';
import type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  OtpFormData,
  ResetPasswordFormData,
  AuthResponse,
  OtpResponse,
} from '../types';

const BASE = '/auth';

export const authApi = {
  login: (data: LoginFormData) =>
    post<AuthResponse>(`${BASE}/login`, data),

  sendOtp: (countryCode: string, mobileNumber: string) =>
  post<OtpResponse>(`${BASE}/send-otp`, {
    countryCode,
    mobileNumber,
  }),

  register: (data: RegisterFormData) =>
    post<AuthResponse>(`${BASE}/register`, data),

  forgotPassword: (data: ForgotPasswordFormData) =>
    post<OtpResponse>(`${BASE}/forgot-password`, data),

  verifyOtp: (data: OtpFormData) =>
    post<OtpResponse>(`${BASE}/verify-otp`, data),

  resetPassword: (data: ResetPasswordFormData) =>
    post<{ success: boolean }>(`${BASE}/reset-password`, data),

  refreshToken: (refreshToken: string) =>
    post<AuthResponse>(`${BASE}/refresh`, { refreshToken }),

  logout: () =>
    post<{ success: boolean }>(`${BASE}/logout`),
};
