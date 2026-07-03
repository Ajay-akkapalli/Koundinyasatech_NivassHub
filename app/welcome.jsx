import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <ImageBackground
        source={require('../assets/images/Splash screen img.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Light Overlay */}
        <View style={styles.overlay}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/LOGO no BG.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Welcome Text */}
          <View style={styles.textContainer}>
            <Text style={styles.welcome}>Welcome!</Text>
            <Text style={styles.subTitle}>To NivaasHub</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.push('/(auth)/register')}
            >
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.75)',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 40,
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },

  logo: {
    width: 260,
    height: 260,
  },

  textContainer: {
    alignItems: 'center',
    marginTop: -50,
  },

  welcome: {
    fontSize: 30,
    fontWeight: '700',
    color: '#082B68',
    marginBottom: 5,
  },

  subTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#082B68',
  },

  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },

  registerButton: {
    backgroundColor: '#0060BD',
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  registerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },

  loginButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0060BD',
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginText: {
    color: '#0060BD',
    fontSize: 20,
    fontWeight: '600',
  },
});