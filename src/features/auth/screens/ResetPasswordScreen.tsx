import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AuthScreenWrapper } from '@components/layout/AuthScreenWrapper';
import { AuthHeader } from '../components/AuthHeader';
import { AuthInput } from '../components/AuthInput';
import { Button } from '@components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useAuthForm } from '../hooks/useAuthForm';
import { validateResetPassword } from '../validation';
import { AUTH_ROUTES } from '../constants';
import type { ResetPasswordFormData } from '../types';

const INITIAL_VALUES: ResetPasswordFormData = {
  password: '',
  confirmPassword: '',
  resetToken: '',
};

export function ResetPasswordScreen() {
  const router = useRouter();
  const { resetToken = '' } = useLocalSearchParams<{ resetToken: string }>();
  const { resetPassword, loading, error } = useAuth();

  const handleReset = useCallback(
    async (values: ResetPasswordFormData): Promise<boolean> => {
      const success = await resetPassword({ ...values, resetToken });
      if (success) {
        router.replace(AUTH_ROUTES.LOGIN as never);
      }
      return success;
    },
    [resetPassword, router, resetToken],
  );

  const { values, errors, submitting, handleChange, handleBlur, handleSubmit } =
    useAuthForm<ResetPasswordFormData>({
      initialValues: { ...INITIAL_VALUES, resetToken },
      validate: validateResetPassword,
      onSubmit: handleReset,
    });

  return (
    <AuthScreenWrapper>
      <AuthHeader
        title="Reset Password"
        subtitle="Create a new secure password for your account."
      />

      {error ? <Text style={styles.globalError}>{error}</Text> : null}

      <AuthInput
        label="New Password"
        value={values.password}
        onChangeText={(v) => handleChange('password', v)}
        onBlur={() => handleBlur('password')}
        error={errors.password}
        isPassword
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
      />

      <AuthInput
        label="Confirm New Password"
        value={values.confirmPassword}
        onChangeText={(v) => handleChange('confirmPassword', v)}
        onBlur={() => handleBlur('confirmPassword')}
        error={errors.confirmPassword}
        isPassword
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />

      <Button
        title="Reset Password"
        onPress={handleSubmit}
        loading={submitting || loading}
        style={styles.submitBtn}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => router.replace(AUTH_ROUTES.LOGIN as never)}
          accessibilityRole="link"
        >
          <Text style={styles.backLink}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </AuthScreenWrapper>
  );
}

const styles = StyleSheet.create({
  globalError: {
    backgroundColor: '#FEF2F2',
    color: '#EF4444',
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  submitBtn: { marginTop: 8 },
  footer: { alignItems: 'center', marginTop: 24 },
  backLink: { fontSize: 14, color: '#1A73E8', fontWeight: '600' },
});
