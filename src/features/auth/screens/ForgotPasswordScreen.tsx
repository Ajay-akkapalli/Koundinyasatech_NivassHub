import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthScreenWrapper } from '@components/layout/AuthScreenWrapper';
import { AuthHeader } from '../components/AuthHeader';
import { AuthInput } from '../components/AuthInput';
import { Button } from '@components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useAuthForm } from '../hooks/useAuthForm';
import { validateForgotPassword } from '../validation';
import { AUTH_ROUTES } from '../constants';
import type { ForgotPasswordFormData } from '../types';

const INITIAL_VALUES: ForgotPasswordFormData = {
  email: '',
};

export function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword, loading, error } = useAuth();

  const handleForgotPassword = useCallback(
    async (values: ForgotPasswordFormData): Promise<boolean> => {
      const success = await forgotPassword(values);
      if (success) {
        router.push({ pathname: AUTH_ROUTES.OTP as never, params: { email: values.email } });
      }
      return success;
    },
    [forgotPassword, router],
  );

  const { values, errors, submitting, handleChange, handleBlur, handleSubmit } =
    useAuthForm<ForgotPasswordFormData>({
      initialValues: INITIAL_VALUES,
      validate: validateForgotPassword,
      onSubmit: handleForgotPassword,
    });

  return (
    <AuthScreenWrapper>
      <AuthHeader
        title="Forgot Password?"
        subtitle="Enter your email and we'll send you a verification code."
      />

      {error ? <Text style={styles.globalError}>{error}</Text> : null}

      <AuthInput
        label="Email"
        value={values.email}
        onChangeText={(v) => handleChange('email', v)}
        onBlur={() => handleBlur('email')}
        error={errors.email}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />

      <Button
        title="Send Verification Code"
        onPress={handleSubmit}
        loading={submitting || loading}
        style={styles.submitBtn}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => router.back()}
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
  submitBtn: {
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  backLink: { fontSize: 14, color: '#1A73E8', fontWeight: '600' },
});
