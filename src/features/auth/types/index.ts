export type UserRole = 'admin' | 'resident' | 'security';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  flat: string;
  block: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
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
  name: string;
  email: string;
  phone: string;
  flat: string;
  block: string;
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
  name?: string;
  email?: string;
  phone?: string;
  flat?: string;
  block?: string;
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
