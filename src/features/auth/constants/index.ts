export const AUTH_ROUTES = {
  LOGIN: '/(auth)/login',
  REGISTER: '/(auth)/register',
  FORGOT_PASSWORD: '/(auth)/forgot-password',
  OTP: '/(auth)/otp',
  RESET_PASSWORD: '/(auth)/reset-password',
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_NOT_FOUND: 'No account found with this email.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  WEAK_PASSWORD: 'Password must be at least 8 characters.',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match.',
  INVALID_OTP: 'Invalid or expired OTP. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
} as const;

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: '@auth/access_token',
  REFRESH_TOKEN: '@auth/refresh_token',
  TOKEN_EXPIRY: '@auth/token_expiry',
  USER: '@auth/user',
} as const;

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;
export const MIN_PASSWORD_LENGTH = 8;
