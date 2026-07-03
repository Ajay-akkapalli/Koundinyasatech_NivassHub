import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { USE_MOCK_API } from '@/mocks/config';
import { mockSendOtp } from '@/mocks/mobileMocks';
import colors from '@theme/colors';

const COUNTRY_CODE = '+91';

export function MobileNumberScreen() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = (value: string) => {
    if (!value || value.length !== 10) return 'Enter a valid 10-digit mobile number.';
    if (!/^\d{10}$/.test(value)) return 'Mobile number must contain digits only.';
    return '';
  };

  const handleSendOtp = useCallback(async () => {
    const err = validate(mobile);
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      let response;
      if (USE_MOCK_API) {
        // MOCK: replace with real API call when backend is ready
        response = await mockSendOtp(mobile);
      } else {
        // REAL API: POST /api/v1/auth/send-otp
        const { post } = await import('@services/api');
        response = await post<{ success: boolean; message: string }>('/auth/send-otp', {
          countryCode: COUNTRY_CODE,
          mobileNumber: mobile,
        });
      }
      if (response.success) {
        router.push({
          pathname: '/(auth)/otp' as any,
          params: { mobileNumber: mobile },
        });
      } else {
        setError(response.message || 'Failed to send OTP. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [mobile, router]);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/splash/onboarding' as any);
    }
  }, [router]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={handleBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backText}>{'<'}</Text>
          </TouchableOpacity>

          {/* Header */}
          <Text style={styles.title}>Enter Mobile Number</Text>
          <Text style={styles.subtitle}>
            We will send a 4 digit code sent to your number.
          </Text>

          {/* Mobile input row */}
          <View style={styles.inputRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>{COUNTRY_CODE}</Text>
            </View>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="9876543210"
              placeholderTextColor={colors.textLight}
              keyboardType="phone-pad"
              maxLength={10}
              value={mobile}
              onChangeText={v => { setMobile(v); if (error) setError(''); }}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSendOtp}
            />
          </View>

          {/* Error */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Terms */}
          <Text style={styles.terms}>
            By Continuing, you agree to Nivaas Hub's{' '}
            <Text style={styles.link}>Terms of Service</Text>
            {' & '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>

          {/* Send OTP button */}
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSendOtp}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.btnText}>Send OTP</Text>
            )}
          </TouchableOpacity>

          {/* Already have account */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/otp' as any)}>
              <Text style={styles.footerLink}>Login</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  backBtn: { marginBottom: 24, width: 36, height: 36, justifyContent: 'center' },
  backText: { fontSize: 22, color: colors.brandDark, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: '700', color: colors.brandDark, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 32, lineHeight: 20 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  countryCode: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginRight: 10,
    backgroundColor: colors.background,
  },
  countryCodeText: { fontSize: 16, color: colors.textPrimary, fontWeight: '500' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },
  inputError: { borderColor: colors.danger },
  errorText: { color: colors.danger, fontSize: 12, marginBottom: 8 },
  terms: { fontSize: 12, color: colors.textSecondary, marginTop: 8, marginBottom: 32, lineHeight: 18 },
  link: { color: colors.brandBlue, fontWeight: '500' },
  btn: {
    backgroundColor: colors.brandBlue,
    borderRadius: 8,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 14, color: colors.textSecondary },
  footerLink: { fontSize: 14, color: colors.brandBlue, fontWeight: '600' },
});
