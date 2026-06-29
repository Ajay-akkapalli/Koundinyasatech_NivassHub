import { REGEX } from '@/constants';
import type {
  LoginFormData, LoginFormErrors,
  RegisterFormData, RegisterFormErrors,
  ForgotPasswordFormData, ForgotPasswordFormErrors,
  OtpFormData, OtpFormErrors,
  ResetPasswordFormData, ResetPasswordFormErrors,
} from '../types';
import { OTP_LENGTH, MIN_PASSWORD_LENGTH } from '../constants';

export function validateLogin(data: LoginFormData): LoginFormErrors {
  const errors: LoginFormErrors = {};
  if (!data.email.trim()) errors.email = 'Email is required.';
  else if (!REGEX.EMAIL.test(data.email)) errors.email = 'Enter a valid email address.';
  if (!data.password) errors.password = 'Password is required.';
  else if (data.password.length < MIN_PASSWORD_LENGTH)
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  return errors;
}

export function validateRegister(data: RegisterFormData): RegisterFormErrors {
  const errors: RegisterFormErrors = {};
  if (!data.name.trim()) errors.name = 'Full name is required.';
  if (!data.email.trim()) errors.email = 'Email is required.';
  else if (!REGEX.EMAIL.test(data.email)) errors.email = 'Enter a valid email address.';
  if (!data.phone.trim()) errors.phone = 'Phone number is required.';
  else if (!REGEX.PHONE_IN.test(data.phone)) errors.phone = 'Enter a valid 10-digit Indian phone number.';
  if (!data.flat.trim()) errors.flat = 'Flat number is required.';
  if (!data.block.trim()) errors.block = 'Block is required.';
  if (!data.password) errors.password = 'Password is required.';
  else if (data.password.length < MIN_PASSWORD_LENGTH)
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (!data.confirmPassword) errors.confirmPassword = 'Please confirm your password.';
  else if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  return errors;
}

export function validateForgotPassword(data: ForgotPasswordFormData): ForgotPasswordFormErrors {
  const errors: ForgotPasswordFormErrors = {};
  if (!data.email.trim()) errors.email = 'Email is required.';
  else if (!REGEX.EMAIL.test(data.email)) errors.email = 'Enter a valid email address.';
  return errors;
}

export function validateOtp(data: OtpFormData): OtpFormErrors {
  const errors: OtpFormErrors = {};
  if (!data.otp.trim()) errors.otp = 'OTP is required.';
  else if (data.otp.length !== OTP_LENGTH) errors.otp = `OTP must be exactly ${OTP_LENGTH} digits.`;
  else if (!/^\d+$/.test(data.otp)) errors.otp = 'OTP must contain digits only.';
  return errors;
}

export function validateResetPassword(data: ResetPasswordFormData): ResetPasswordFormErrors {
  const errors: ResetPasswordFormErrors = {};
  if (!data.password) errors.password = 'New password is required.';
  else if (data.password.length < MIN_PASSWORD_LENGTH)
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (!data.confirmPassword) errors.confirmPassword = 'Please confirm your new password.';
  else if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  return errors;
}

export function isFormValid(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).every((v) => !v);
}
