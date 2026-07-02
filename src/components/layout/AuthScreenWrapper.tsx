import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthScreenWrapperProps {
  children: React.ReactNode;
}

/**
 * Shared layout shell for every auth screen.
 * Handles keyboard avoidance, safe-area insets, and scroll behaviour
 * in a single place so each screen owns only its own content.
 */
export const AuthScreenWrapper: React.FC<AuthScreenWrapperProps> = ({ children }) => (
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
        <View style={styles.container}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

export default AuthScreenWrapper;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
});
