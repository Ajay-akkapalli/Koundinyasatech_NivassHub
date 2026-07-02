import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { USE_MOCK_API } from '@/mocks/config';
import { mockVerifyOtp, mockResendOtp } from '@/mocks/mobileMocks';
import colors from '@theme/colors';

const OTP_LENGTH = 4;
const RESEND_COUNTDOWN = 60; // seconds

export function OtpVerificationScreen() {
  const router = useRouter();
  const { mobileNumber = '' } = useLocalSearchParams<{ mobileNumber: string }>();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ── OTP box input handler ─────────────────────────────────────────────────
  const handleOtpChange = useCallback((text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError('');

    // Move focus forward
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (digit && index === OTP_LENGTH - 1) {
      const filled = [...newOtp.slice(0, OTP_LENGTH - 1), digit];
      if (filled.every(d => d !== '')) {
        verifyOtpCode(filled.join(''));
      }
    }
  }, [otp]);

  // ── Backspace moves focus back ────────────────────────────────────────────
  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
      if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  // ── Verify OTP ────────────────────────────────────────────────────────────
  const verifyOtpCode = useCallback(async (code: string) => {
    if (code.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit OTP.`);
      return;
    }
    setLoading(true);
    setError('');
    try {
      let response;
      if (USE_MOCK_API) {
        // MOCK: replace with real API call when backend is ready
        response = await mockVerifyOtp(mobileNumber, code);
      } else {
        // REAL API: POST /api/v1/auth/verify-otp
        const { post } = await import('@services/api');
        response = await post<{
          success: boolean;
          message: string;
          data?: { userExists: boolean; registrationToken: string };
        }>('/auth/verify-otp', { mobileNumber, otp: code });
      }

      if (response.success && response.data) {
        if (response.data.userExists) {
          // Existing user → go to Home
          router.replace('/(tabs)' as any);
        } else {
          // New user → go to Create Profile
          router.push({
            pathname: '/(auth)/register' as any,
            params: {
              mobileNumber,
              registrationToken: response.data.registrationToken,
            },
          });
        }
      } else {
        setError(response.message || 'Invalid OTP. Please try again.');
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [mobileNumber, router]);

  const handleVerifyPress = useCallback(() => {
    verifyOtpCode(otp.join(''));
  }, [otp, verifyOtpCode]);

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = useCallback(async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      if (USE_MOCK_API) {
        // MOCK: replace with real API call when backend is ready
        await mockResendOtp();
      } else {
        // REAL API: POST /api/v1/auth/resend-otp
        const { post } = await import('@services/api');
        await post('/auth/resend-otp', { mobileNumber });
      }
      setOtp(Array(OTP_LENGTH).fill(''));
      setCountdown(RESEND_COUNTDOWN);
      inputRefs.current[0]?.focus();
    } catch {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  }, [countdown, resending, mobileNumber]);

  const handleBack = useCallback(() => router.back(), [router]);

  const maskedNumber = mobileNumber
    ? `+91 ${mobileNumber.slice(0, 2)}XXXXXX${mobileNumber.slice(-2)}`
    : '+91 XXXXXXXXXX';

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
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backText}>{'<'}</Text>
          </TouchableOpacity>

          {/* Header */}
          <Text style={styles.title}>Verify Your Number</Text>
          <Text style={styles.subtitle}>
            Enter the 4 digit code sent to you at{'\n'}
            <Text style={styles.mobileHighlight}>{maskedNumber}</Text>
          </Text>

          {/* Error banner */}
          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* OTP boxes */}
          <View style={styles.otpRow}>
            {Array(OTP_LENGTH).fill(0).map((_, index) => (
              <TextInput
                key={index}
                ref={ref => { inputRefs.current[index] = ref; }}
                style={[
                  styles.otpBox,
                  otp[index] ? styles.otpBoxFilled : null,
                  error ? styles.otpBoxError : null,
                ]}
                value={otp[index]}
                onChangeText={text => handleOtpChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                autoFocus={index === 0}
              />
            ))}
          </View>

          {/* Countdown */}
          <View style={styles.countdownRow}>
            <Text style={styles.countdownLabel}>Code expires in: </Text>
            <Text style={[
              styles.countdownValue,
              countdown === 0 && styles.countdownExpired,
            ]}>
              {formatTime(countdown)}
            </Text>
          </View>

          {/* Verify button */}
          <TouchableOpacity
            style={[styles.btn, (loading || otp.some(d => !d)) && styles.btnDisabled]}
            onPress={handleVerifyPress}
            disabled={loading || otp.some(d => !d)}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.btnText}>Verify OTP</Text>
            )}
          </TouchableOpacity>

          {/* Already have account */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => router.replace('/splash/welcome' as any)}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text style={styles.footerLink}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* Resend */}
          <View style={styles.resendRow}>
            <Text style={styles.footerText}>Didn't receive code? </Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={countdown > 0 || resending}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              {resending ? (
                <ActivityIndicator size="small" color={colors.brandBlue} />
              ) : (
                <Text style={[
                  styles.footerLink,
                  countdown > 0 && styles.footerLinkDisabled,
                ]}>
                  {countdown > 0 ? `Resend Code` : 'Resend Code'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Privacy note */}
          <Text style={styles.privacy}>
            By Continuing, you agree to Nivaas Hub's{' '}
            <Text style={styles.privacyLink}>Privacy Policy</Text>
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },

  backBtn: { marginBottom: 24, width: 36, height: 36, justifyContent: 'center' },
  backText: { fontSize: 22, color: colors.brandDark, fontWeight: '600' },

  title: { fontSize: 22, fontWeight: '700', color: colors.brandDark, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 32, lineHeight: 22 },
  mobileHighlight: { color: colors.brandDark, fontWeight: '600' },

  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorText: { color: '#EF4444', fontSize: 13, textAlign: 'center' },

  // ── OTP boxes ──────────────────────────────────────────────────────────────
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  otpBoxFilled: {
    borderColor: colors.brandBlue,
    backgroundColor: colors.white,
  },
  otpBoxError: {
    borderColor: colors.danger,
  },

  // ── Countdown ──────────────────────────────────────────────────────────────
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  countdownLabel: { fontSize: 13, color: colors.textSecondary },
  countdownValue: { fontSize: 13, fontWeight: '700', color: colors.brandBlue },
  countdownExpired: { color: colors.danger },

  // ── Button ─────────────────────────────────────────────────────────────────
  btn: {
    backgroundColor: colors.brandBlue,
    borderRadius: 8,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: colors.white, fontSize: 16, fontWeight: '600' },

  // ── Footer ─────────────────────────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: { fontSize: 14, color: colors.textSecondary },
  footerLink: { fontSize: 14, color: colors.brandBlue, fontWeight: '600' },
  footerLinkDisabled: { color: colors.textLight },

  privacy: { fontSize: 11, color: colors.textLight, textAlign: 'center', lineHeight: 16 },
  privacyLink: { color: colors.brandBlue },
});
