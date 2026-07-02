import { useCallback } from 'react';
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

/**
 * Centralised auth operations hook.
 *
 * Every method:
 *  - sets loading true at the start
 *  - always sets loading false in the finally block (previously missing on success paths)
 *  - returns a boolean so the calling screen can navigate on success
 */
export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  const login = useCallback(
    async (data: LoginFormData): Promise<boolean> => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const response = await authService.login(data);
        dispatch(setAuth({ user: response.user, token: response.token }));
        return true;
      } catch {
        dispatch(setError(AUTH_ERRORS.INVALID_CREDENTIALS));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const register = useCallback(
    async (data: RegisterFormData): Promise<boolean> => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const response = await authService.register(data);
        dispatch(setAuth({ user: response.user, token: response.token }));
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : AUTH_ERRORS.UNKNOWN_ERROR;
        dispatch(setError(message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const forgotPassword = useCallback(
    async (data: ForgotPasswordFormData): Promise<boolean> => {
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
    },
    [dispatch],
  );

  const verifyOtp = useCallback(
    async (data: OtpFormData): Promise<boolean> => {
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
    },
    [dispatch],
  );

  const resetPassword = useCallback(
    async (data: ResetPasswordFormData): Promise<boolean> => {
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
    },
    [dispatch],
  );

  const logout = useCallback(async (): Promise<void> => {
    await authService.logout();
    dispatch(clearAuth());
  }, [dispatch]);

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
