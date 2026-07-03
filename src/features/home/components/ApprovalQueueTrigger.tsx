import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getInitials } from '@utils/formatters';
import colors from '@theme/colors';
import spacing from '@theme/spacing';
import type { ApprovalVisitor } from '../types';

const AVATAR_OVERLAP = 10;
const MAX_PREVIEW = 3;

interface ApprovalQueueTriggerProps {
  count: number;
  items: ApprovalVisitor[];
  onPress: () => void;
}

export const ApprovalQueueTrigger: React.FC<ApprovalQueueTriggerProps> = React.memo(
  ({ count, items, onPress }) => {
    const preview = items.slice(0, MAX_PREVIEW);
    const overflow = items.length - MAX_PREVIEW;

    // Avatar background colours cycle through a small palette
    const AVATAR_COLORS = [
      colors.primary,
      colors.primaryLight,
      colors.secondary,
      '#6A1B9A',
    ];

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.82}
        accessibilityLabel={`Open approval queue, ${count} pending`}
        accessibilityRole="button"
      >
        {/* Left accent bar */}
        <View style={styles.accentBar} />

        {/* Content */}
        <View style={styles.content}>
          {/* Header row */}
          <View style={styles.headerRow}>
            <View style={styles.titleGroup}>
              <Ionicons name="people-outline" size={18} color={colors.primary} />
              <Text style={styles.title}>Approval Queue</Text>
              {count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{count}</Text>
                </View>
              )}
            </View>
            <View style={styles.viewAllGroup}>
              <Text style={styles.viewAllText}>View all</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.primary} />
            </View>
          </View>

          {/* Body row */}
          {items.length === 0 ? (
            <View style={styles.emptyRow}>
              <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
              <Text style={styles.emptyText}>No pending visitors</Text>
            </View>
          ) : (
            <View style={styles.bodyRow}>
              {/* Stacked avatars */}
              <View style={styles.avatarStack}>
                {preview.map((visitor, index) => (
                  <View
                    key={visitor.visitorId}
                    style={[
                      styles.avatar,
                      {
                        backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
                        marginLeft: index > 0 ? -AVATAR_OVERLAP : 0,
                        zIndex: MAX_PREVIEW - index,
                      },
                    ]}
                  >
                    <Text style={styles.avatarText}>{getInitials(visitor.visitorName)}</Text>
                  </View>
                ))}
                {overflow > 0 && (
                  <View
                    style={[
                      styles.avatar,
                      styles.overflowAvatar,
                      { marginLeft: -AVATAR_OVERLAP },
                    ]}
                  >
                    <Text style={styles.overflowText}>+{overflow}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.pendingLabel} numberOfLines={1}>
                {count} visitor{count !== 1 ? 's' : ''} awaiting approval
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 14,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  accentBar: {
    width: 4,
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  viewAllGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  avatarText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  overflowAvatar: {
    backgroundColor: colors.border,
    zIndex: 0,
  },
  overflowText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  pendingLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
