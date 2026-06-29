import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import SplashLogo from '@components/splash/SplashLogo';
import colors from '@theme/colors';
import spacing from '@theme/spacing';
import { SPLASH } from '@constants/dimensions';

export default function WelcomeScreen(): React.JSX.Element {
  const router = useRouter();

  const handleRegister = (): void => {
    router.replace('/(auth)/register');
  };

  const handleLogin = (): void => {
    router.replace('/(auth)/login');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/Splash screen img.png')}
      style={styles.background}
      resizeMode="cover"
      blurRadius={2}
    >
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <SplashLogo variant="full" size={SPLASH.LOGO_FULL_SIZE} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.subtitle}>To NivaasHub</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: spacing.screenPadding + spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.brandDark,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.brandDark,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  registerButton: {
    backgroundColor: colors.brandBlue,
    height: SPLASH.BUTTON_HEIGHT,
    borderRadius: SPLASH.BUTTON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md + spacing.sm,
  },
  registerButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: colors.white,
    height: SPLASH.BUTTON_HEIGHT,
    borderRadius: SPLASH.BUTTON_BORDER_RADIUS,
    borderWidth: SPLASH.BUTTON_BORDER_WIDTH,
    borderColor: colors.brandBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.brandBlue,
    fontSize: 18,
    fontWeight: '600',
  },
});
