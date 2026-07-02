export type UserRole = 'admin' | 'resident' | 'security';

export interface User {
  userId: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  address: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthState {
  user: User | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// ── Form data ────────────────────────────────────────────────────────────────

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  mobileNumber: string;
  address: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface OtpFormData {
  otp: string;
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
  resetToken: string;
}

// ── API responses ────────────────────────────────────────────────────────────

/**
 * Raw shape returned by POST /auth/register and POST /auth/login.
 * Mapped to AuthResponse inside authApi before the rest of the app sees it.
 */
export interface RegisterApiResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    accessToken: string;
    refreshToken: string;
  };
}

export interface AuthResponse {
  user: User;
  token: AuthToken;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  resetToken?: string;
}

// ── Form errors ──────────────────────────────────────────────────────────────

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface RegisterFormErrors {
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
}

export interface ForgotPasswordFormErrors {
  email?: string;
}

export interface OtpFormErrors {
  otp?: string;
}

export interface ResetPasswordFormErrors {
  password?: string;
  confirmPassword?: string;
}
