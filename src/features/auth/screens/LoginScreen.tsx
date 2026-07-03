import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

export const LoginScreen: React.FC = () => {
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const value = identifier.trim();

    if (!value) {
      Alert.alert("Validation", "Please enter Email or Mobile Number.");
      return false;
    }

    if (!password.trim()) {
      Alert.alert("Validation", "Please enter Password.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!emailRegex.test(value) && !mobileRegex.test(value)) {
      Alert.alert(
        "Validation",
        "Please enter a valid Email or 10-digit Mobile Number."
      );
      return false;
    }

    if (password.length < 7) {
      Alert.alert(
        "Validation",
        "Password must contain at least 7 characters."
      );
      return false;
    }

    return true;
  };

  const handleLogin = (): void => {
    if (!validateForm()) return;

    Alert.alert("Success", "Login Successful!", [
      {
        text: "OK",
        onPress: () => {
          router.replace("/(tabs)");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>N</Text>
              </View>

              <Text style={styles.appName}>NivassHub</Text>
              <Text style={styles.welcomeText}>
                Welcome back! Please login to continue.
              </Text>
            </View>

            {/* Card */}
            <View style={styles.card}>
              <Text style={styles.heading}>Login</Text>

              <Text style={styles.label}>Email / Mobile Number</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter Email or Mobile Number"
                placeholderTextColor="#9CA3AF"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                keyboardType="default"
              />

              <Text style={styles.label}>Password</Text>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.showText}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.forgotContainer}
                onPress={() => router.push("/(auth)/forgot-password")}
              >
                <Text style={styles.forgotText}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>
                  Login
                </Text>
              </TouchableOpacity>

              <View style={styles.bottomContainer}>
                <Text style={styles.bottomText}>
                  Don't have an account?
                </Text>

                <TouchableOpacity
                  onPress={() => router.push("/(auth)/register")}
                >
                  <Text style={styles.registerText}>
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F8FC",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 30,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  // Logo Section
  logoContainer: {
    alignItems: "center",
    marginBottom: 35,
  },

  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#0A66C2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  logoText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  appName: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0A66C2",
    marginBottom: 6,
  },

  welcomeText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },

  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 25,
    textAlign: "center",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#D6E4F0",
    borderRadius: 12,
    backgroundColor: "#F9FBFD",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D6E4F0",
    borderRadius: 12,
    backgroundColor: "#F9FBFD",
    height: 55,
    paddingHorizontal: 16,
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },

  showText: {
    color: "#0A66C2",
    fontWeight: "700",
    fontSize: 14,
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginTop: 14,
  },

  forgotText: {
    color: "#0A66C2",
    fontSize: 14,
    fontWeight: "600",
  },

  loginButton: {
    backgroundColor: "#0A66C2",
    height: 55,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
    elevation: 3,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  bottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },

  bottomText: {
    color: "#6B7280",
    fontSize: 15,
  },

  registerText: {
    color: "#0A66C2",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 5,
  },
});