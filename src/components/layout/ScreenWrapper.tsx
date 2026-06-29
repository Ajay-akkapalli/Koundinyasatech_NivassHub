import React from 'react';
import { View, StyleSheet, StatusBar, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@theme/colors';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style }) => (
  <SafeAreaView style={styles.safe} edges={['top']}>
    <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
    <View style={[styles.container, style]}>{children}</View>
  </SafeAreaView>
);

export default ScreenWrapper;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
