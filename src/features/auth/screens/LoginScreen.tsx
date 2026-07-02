import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthScreenWrapper } from '@components/layout/AuthScreenWrapper';
import { AuthHeader } from '../components/AuthHeader';
import { AuthInput } from '../components/AuthInput';
import { Button } from '@components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useAuthForm } from '../hooks/useAuthForm';
import { validateLogin } from '../validation';
import { AUTH_ROUTES } from '../constants';
import type { LoginFormData } from '../types';

const INITIAL_VALUES: LoginFormData = {
  email: '',
  password: '',
};

export function LoginScreen() {
  const router = useRouter();
  const { login, loading, error } = useAuth();

  const handleLogin = useCallback(
    async (values: LoginFormData): Promise<boolean> => {
      const success = await login(values);
      if (success) {
        router.replace('/(tabs)');
      }
      return success;
    },
    [login, router],
  );

  const { values, errors, submitting, handleChange, handleBlur, handleSubmit } =
    useAuthForm<LoginFormData>({
      initialValues: INITIAL_VALUES,
      validate: validateLogin,
      onSubmit: handleLogin,
    });

  return (
    <AuthScreenWrapper>
      <AuthHeader
        title="Sign In"
        subtitle="Welcome back! Enter your credentials to continue."
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
        returnKeyType="next"
      />

      <AuthInput
        label="Password"
        value={values.password}
        onChangeText={(v) => handleChange('password', v)}
        onBlur={() => handleBlur('password')}
        error={errors.password}
        isPassword
        autoComplete="password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />

      <TouchableOpacity
        style={styles.forgotLink}
        onPress={() => router.push(AUTH_ROUTES.FORGOT_PASSWORD as never)}
        accessibilityRole="link"
      >
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <Button
        title="Sign In"
        onPress={handleSubmit}
        loading={submitting || loading}
        style={styles.submitBtn}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity
          onPress={() => router.push(AUTH_ROUTES.REGISTER as never)}
          accessibilityRole="link"
        >
          <Text style={styles.footerLink}>Register</Text>
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
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    color: '#1A73E8',
    fontWeight: '500',
  },
  submitBtn: {
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: { fontSize: 14, color: '#6B7280' },
  footerLink: { fontSize: 14, color: '#1A73E8', fontWeight: '600' },
});
