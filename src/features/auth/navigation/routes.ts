export const AUTH_SCREEN_ROUTES = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgot-password',
  OTP: 'otp',
  RESET_PASSWORD: 'reset-password',
} as const;

export type AuthScreenRoute =
  (typeof AUTH_SCREEN_ROUTES)[keyof typeof AUTH_SCREEN_ROUTES];
