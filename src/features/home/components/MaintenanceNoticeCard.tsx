import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@theme/colors';
import spacing from '@theme/spacing';

interface MaintenanceNoticeCardProps {
  message: string;
}

export const MaintenanceNoticeCard: React.FC<MaintenanceNoticeCardProps> = ({ message }) => {
  if (!message) return null;

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="information-circle-outline" size={20} color={colors.info} />
      </View>
      <Text style={styles.message} numberOfLines={2}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.info + '12',
    borderLeftWidth: 3,
    borderLeftColor: colors.info,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: spacing.md,
  },
  iconWrap: { marginRight: 10 },
  message: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
});
