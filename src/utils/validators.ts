import { REGEX } from '@constants/regex';

export const isValidPhone = (phone: string): boolean => REGEX.PHONE_IN.test(phone);

export const isValidEmail = (email: string): boolean => REGEX.EMAIL.test(email);

export const isNotEmpty = (value: unknown): boolean =>
  value !== null && value !== undefined && String(value).trim().length > 0;
