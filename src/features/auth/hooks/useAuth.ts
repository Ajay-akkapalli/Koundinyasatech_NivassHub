import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@store/rootReducer';
import { authService } from '../services';
import { setAuth, clearAuth, setLoading, setError } from '../store';
import { AUTH_ERRORS } from '../constants';
import type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  OtpFormData,
  ResetPasswordFormData,
} from '../types';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  async function login(data: LoginFormData): Promise<boolean> {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await authService.login(data);
      dispatch(setAuth({ user: response.user, token: response.token }));
      return true;
    } catch {
      dispatch(setError(AUTH_ERRORS.INVALID_CREDENTIALS));
      return false;
    }
  }

  async function register(data: RegisterFormData): Promise<boolean> {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await authService.register(data);
      dispatch(setAuth({ user: response.user, token: response.token }));
      return true;
    } catch {
      dispatch(setError(AUTH_ERRORS.UNKNOWN_ERROR));
      return false;
    }
  }

  async function forgotPassword(data: ForgotPasswordFormData): Promise<boolean> {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await authService.forgotPassword(data);
      return true;
    } catch {
      dispatch(setError(AUTH_ERRORS.EMAIL_NOT_FOUND));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function verifyOtp(data: OtpFormData): Promise<boolean> {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const result = await authService.verifyOtp(data);
      return result.success;
    } catch {
      dispatch(setError(AUTH_ERRORS.INVALID_OTP));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function resetPassword(data: ResetPasswordFormData): Promise<boolean> {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const result = await authService.resetPassword(data);
      return result.success;
    } catch {
      dispatch(setError(AUTH_ERRORS.UNKNOWN_ERROR));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function logout(): Promise<void> {
    await authService.logout();
    dispatch(clearAuth());
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    forgotPassword,
    verifyOtp,
    resetPassword,
    logout,
  };
}
