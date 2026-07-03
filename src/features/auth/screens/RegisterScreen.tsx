import React, { useCallback, useRef, useState } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { USE_MOCK_API } from '@/mocks/config';
import { mockRegister } from '@/mocks/authMocks';
import colors from '@theme/colors';

// ─── Validation ───────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

function validate(values: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
}) {
  const errors: Record<string, string> = {};
  if (!(values.fullName ?? '').trim()) errors.fullName = 'Full name is required.';
  if (!(values.email ?? '').trim()) errors.email = 'Email is required.';
  else if (!EMAIL_REGEX.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (!(values.password ?? '')) errors.password = 'Password is required.';
  else if (values.password.length < MIN_PASSWORD)
    errors.password = `Password must be at least ${MIN_PASSWORD} characters.`;
  if (!(values.confirmPassword ?? '')) errors.confirmPassword = 'Please confirm your password.';
  else if (values.password !== values.confirmPassword)
    errors.confirmPassword = 'Passwords do not match.';
  if (!(values.address ?? '').trim()) errors.address = 'Address is required.';
  return errors;
}

// ─── Password input with show/hide ────────────────────────────────────────────

function PasswordInput({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  inputRef,
  returnKeyType = 'next',
  onSubmitEditing,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  inputRef?: React.RefObject<TextInput>;
  returnKeyType?: 'next' | 'done';
  onSubmitEditing?: () => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <View style={fieldStyles.wrapper}>
      <Text style={fieldStyles.label}>{label}</Text>
      <View style={[fieldStyles.row, error ? fieldStyles.rowError : null]}>
        <TextInput
          ref={inputRef}
          style={fieldStyles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!show}
          autoCapitalize="none"
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={returnKeyType === 'done'}
        />
        <TouchableOpacity onPress={() => setShow(s => !s)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={fieldStyles.toggle}>{show ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={fieldStyles.error}>{error}</Text> : null}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, marginBottom: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
  },
  rowError: { borderColor: colors.danger },
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: colors.textPrimary },
  toggle: { fontSize: 13, color: colors.brandBlue, fontWeight: '500', paddingLeft: 8 },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function RegisterScreen() {
  const router = useRouter();
  // mobileNumber is passed from OTP screen via params
  const { mobileNumber = '', registrationToken = '' } =
    useLocalSearchParams<{ mobileNumber: string; registrationToken: string }>();

  const [fullName, setFullName]             = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress]               = useState('');
  const [errors, setErrors]                 = useState<Record<string, string>>({});
  const [apiError, setApiError]             = useState('');
  const [loading, setLoading]               = useState(false);

  const emailRef           = useRef<TextInput>(null);
  const passwordRef        = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const addressRef         = useRef<TextInput>(null);

  const handleSubmit = useCallback(async () => {
    const values = { fullName, email, password, confirmPassword, address };
    const errs = validate(values);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setApiError('');
    setLoading(true);
    try {
      let response;
      if (USE_MOCK_API) {
        // MOCK: replace with real API call when backend is ready
        response = await mockRegister({
          fullName, email, password, confirmPassword, address,
          mobileNumber: mobileNumber || '0000000000',
        });
      } else {
        // REAL API: POST /api/v1/auth/register
        const { post } = await import('@services/api');
        response = await post<{ success: boolean; message: string }>('/auth/register', {
          mobileNumber,
          fullName,
          email,
          password,
          confirmPassword,
          address,
        });
      }
      if (response.success) {
        router.replace('/(tabs)' as any);
      } else {
        setApiError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setApiError(err?.message || 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [fullName, email, password, confirmPassword, address, mobileNumber, router]);

  const handleBack = useCallback(() => router.back(), [router]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backText}>{'<'}</Text>
          </TouchableOpacity>

          {/* Header */}
          <Text style={styles.title}>Create Your Profile</Text>
          <Text style={styles.subtitle}>
            Fill in a little info about yourself to get joined.
          </Text>

          {/* API error banner */}
          {apiError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{apiError}</Text>
            </View>
          ) : null}

          {/* ── Fullname ───────────────────────────────────────── */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Fullname</Text>
            <TextInput
              style={[styles.input, errors.fullName ? styles.inputError : null]}
              placeholder="User 1"
              placeholderTextColor={colors.textLight}
              value={fullName}
              onChangeText={v => { setFullName(v); setErrors(e => ({ ...e, fullName: '' })); }}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              blurOnSubmit={false}
            />
            {errors.fullName ? <Text style={styles.fieldError}>{errors.fullName}</Text> : null}
          </View>

          {/* ── Email ─────────────────────────────────────────── */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              ref={emailRef}
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="user.1@gmail.com"
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={v => { setEmail(v); setErrors(e => ({ ...e, email: '' })); }}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
            />
            {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}
          </View>

          {/* ── Create Password ───────────────────────────────── */}
          <PasswordInput
            label="Create Password"
            placeholder="············"
            value={password}
            onChangeText={v => { setPassword(v); setErrors(e => ({ ...e, password: '' })); }}
            error={errors.password}
            inputRef={passwordRef}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          />

          {/* ── Confirm Password ──────────────────────────────── */}
          <PasswordInput
            label="Confirm Password"
            placeholder="············"
            value={confirmPassword}
            onChangeText={v => { setConfirmPassword(v); setErrors(e => ({ ...e, confirmPassword: '' })); }}
            error={errors.confirmPassword}
            inputRef={confirmPasswordRef}
            returnKeyType="next"
            onSubmitEditing={() => addressRef.current?.focus()}
          />

          {/* ── Address ───────────────────────────────────────── */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              ref={addressRef}
              style={[styles.input, errors.address ? styles.inputError : null]}
              placeholder="Hyderabad/2345678900"
              placeholderTextColor={colors.textLight}
              value={address}
              onChangeText={v => { setAddress(v); setErrors(e => ({ ...e, address: '' })); }}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            {errors.address ? <Text style={styles.fieldError}>{errors.address}</Text> : null}
          </View>

          {/* ── Continue button ───────────────────────────────── */}
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.btnText}>Continue</Text>
            )}
          </TouchableOpacity>

          {/* ── Already have account ──────────────────────────── */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => router.replace('/splash/welcome' as any)}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text style={styles.footerLink}>Login</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.white },
  flex:    { flex: 1 },
  scroll:  { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },

  backBtn:  { marginBottom: 24, width: 36, height: 36, justifyContent: 'center' },
  backText: { fontSize: 22, color: colors.brandDark, fontWeight: '600' },

  title:    { fontSize: 22, fontWeight: '700', color: colors.brandDark, marginBottom: 6 },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 24, lineHeight: 18 },

  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorBannerText: { color: '#EF4444', fontSize: 13, textAlign: 'center' },

  fieldWrapper: { marginBottom: 16 },
  label:        { fontSize: 13, fontWeight: '600', color: colors.textPrimary, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },
  inputError:  { borderColor: colors.danger },
  fieldError:  { color: colors.danger, fontSize: 12, marginTop: 4 },

  btn: {
    backgroundColor: colors.brandBlue,
    borderRadius: 8,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  btnDisabled: { opacity: 0.6 },
  btnText:     { color: colors.white, fontSize: 16, fontWeight: '600' },

  footer:      { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText:  { fontSize: 14, color: colors.textSecondary },
  footerLink:  { fontSize: 14, color: colors.brandBlue, fontWeight: '600' },
});
