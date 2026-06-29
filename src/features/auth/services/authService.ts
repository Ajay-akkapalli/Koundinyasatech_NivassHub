import { storeData, getData, removeData } from '@/utils/storage';
import { authApi } from '../api/authApi';
import { AUTH_STORAGE_KEYS } from '../constants';
import type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  OtpFormData,
  ResetPasswordFormData,
  AuthResponse,
  OtpResponse,
  AuthToken,
  User,
} from '../types';

async function persistToken(token: AuthToken): Promise<void> {
  await Promise.all([
    storeData(AUTH_STORAGE_KEYS.ACCESS_TOKEN, token.accessToken),
    storeData(AUTH_STORAGE_KEYS.REFRESH_TOKEN, token.refreshToken),
    storeData(AUTH_STORAGE_KEYS.TOKEN_EXPIRY, token.expiresAt),
  ]);
}

async function persistUser(user: User): Promise<void> {
  await storeData(AUTH_STORAGE_KEYS.USER, user);
}

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await authApi.login(data);
    await persistToken(response.token);
    await persistUser(response.user);
    return response;
  },

  async register(data: RegisterFormData): Promise<AuthResponse> {
    const response = await authApi.register(data);
    await persistToken(response.token);
    await persistUser(response.user);
    return response;
  },

  forgotPassword(data: ForgotPasswordFormData): Promise<OtpResponse> {
    return authApi.forgotPassword(data);
  },

  verifyOtp(data: OtpFormData): Promise<OtpResponse> {
    return authApi.verifyOtp(data);
  },

  resetPassword(data: ResetPasswordFormData): Promise<{ success: boolean }> {
    return authApi.resetPassword(data);
  },

  async logout(): Promise<void> {
    try {
      await authApi.logout();
    } catch {
      // best-effort: clear local state regardless
    }
    await Promise.all(
      Object.values(AUTH_STORAGE_KEYS).map((key) => removeData(key)),
    );
  },

  async getStoredToken(): Promise<AuthToken | null> {
    const [accessToken, refreshToken, expiresAt] = await Promise.all([
      getData<string>(AUTH_STORAGE_KEYS.ACCESS_TOKEN),
      getData<string>(AUTH_STORAGE_KEYS.REFRESH_TOKEN),
      getData<number>(AUTH_STORAGE_KEYS.TOKEN_EXPIRY),
    ]);
    if (!accessToken || !refreshToken || expiresAt === null) return null;
    return { accessToken, refreshToken, expiresAt };
  },

  async getStoredUser(): Promise<User | null> {
    return getData<User>(AUTH_STORAGE_KEYS.USER);
  },
};
