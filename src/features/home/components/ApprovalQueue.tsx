import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@theme/colors';
import spacing from '@theme/spacing';
import type { ApprovalVisitor } from '../types';
import { ApprovalVisitorCard } from './ApprovalVisitorCard';

interface ApprovalQueueProps {
  items: ApprovalVisitor[];
  count: number;
  processingIds: string[];
  onApprove: (visitorId: string) => void;
  onReject: (visitorId: string) => void;
  onCallGuard: () => void;
}

export const ApprovalQueue: React.FC<ApprovalQueueProps> = ({
  items,
  count,
  processingIds,
  onApprove,
  onReject,
  onCallGuard,
}) => (
  <View style={styles.wrapper}>
    {/* Section header */}
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Entry Updates</Text>
        {count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity activeOpacity={0.7} accessibilityRole="button">
        <Text style={styles.viewAll}>View all</Text>
      </TouchableOpacity>
    </View>

    {/* Visitor cards or empty state */}
    {items.length === 0 ? (
      <View style={styles.empty}>
        <Ionicons name="checkmark-circle-outline" size={40} color={colors.success} />
        <Text style={styles.emptyText}>No pending visitors</Text>
      </View>
    ) : (
      items.map((visitor) => (
        <ApprovalVisitorCard
          key={visitor.visitorId}
          visitor={visitor}
          isProcessing={processingIds.includes(visitor.visitorId)}
          onApprove={onApprove}
          onReject={onReject}
          onCallGuard={onCallGuard}
        />
      ))
    )}
  </View>
);

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.xl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  badge: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  viewAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 1,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
