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
  const email = (data.email ?? '').trim();
  const password = data.password ?? '';
  if (!email) errors.email = 'Email is required.';
  else if (!REGEX.EMAIL.test(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Password is required.';
  else if (password.length < MIN_PASSWORD_LENGTH)
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  return errors;
}

export function validateRegister(data: RegisterFormData): RegisterFormErrors {
  const errors: RegisterFormErrors = {};
  const fullName = (data.fullName ?? '').trim();
  const email = (data.email ?? '').trim();
  const mobileNumber = (data.mobileNumber ?? '').trim();
  const address = (data.address ?? '').trim();
  const password = data.password ?? '';
  const confirmPassword = data.confirmPassword ?? '';

  if (!fullName) errors.fullName = 'Full name is required.';
  if (!email) errors.email = 'Email is required.';
  else if (!REGEX.EMAIL.test(email)) errors.email = 'Enter a valid email address.';
  if (!mobileNumber) errors.mobileNumber = 'Mobile number is required.';
  else if (!REGEX.PHONE_IN.test(mobileNumber)) errors.mobileNumber = 'Enter a valid 10-digit mobile number.';
  if (!address) errors.address = 'Address is required.';
  if (!password) errors.password = 'Password is required.';
  else if (password.length < MIN_PASSWORD_LENGTH)
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.';
  else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  return errors;
}

export function validateForgotPassword(data: ForgotPasswordFormData): ForgotPasswordFormErrors {
  const errors: ForgotPasswordFormErrors = {};
  const email = (data.email ?? '').trim();
  if (!email) errors.email = 'Email is required.';
  else if (!REGEX.EMAIL.test(email)) errors.email = 'Enter a valid email address.';
  return errors;
}

export function validateOtp(data: OtpFormData): OtpFormErrors {
  const errors: OtpFormErrors = {};
  const otp = (data.otp ?? '').trim();
  if (!otp) errors.otp = 'OTP is required.';
  else if (otp.length !== OTP_LENGTH) errors.otp = `OTP must be exactly ${OTP_LENGTH} digits.`;
  else if (!/^\d+$/.test(otp)) errors.otp = 'OTP must contain digits only.';
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
