import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getInitials } from '@utils/formatters';
import colors from '@theme/colors';
import spacing from '@theme/spacing';
import type { ApprovalVisitor } from '../types';

interface ApprovalVisitorCardProps {
  visitor: ApprovalVisitor;
  isProcessing: boolean;
  onApprove: (visitorId: string) => void;
  onReject: (visitorId: string) => void;
  onCallGuard: () => void;
}

export const ApprovalVisitorCard: React.FC<ApprovalVisitorCardProps> = ({
  visitor,
  isProcessing,
  onApprove,
  onReject,
  onCallGuard,
}) => {
  const initials = getInitials(visitor.visitorName);

  return (
    <View style={styles.card}>
      {/* Avatar + info row */}
      <View style={styles.infoRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{visitor.visitorName}</Text>
          <Text style={styles.flat}>Unit {visitor.flat}</Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.approveBtn, isProcessing && styles.disabledBtn]}
          onPress={() => onApprove(visitor.visitorId)}
          disabled={isProcessing}
          activeOpacity={0.8}
          accessibilityLabel={`Approve ${visitor.visitorName}`}
          accessibilityRole="button"
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.btnText}>APPROVE</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.rejectBtn, isProcessing && styles.disabledBtn]}
          onPress={() => onReject(visitor.visitorId)}
          disabled={isProcessing}
          activeOpacity={0.8}
          accessibilityLabel={`Reject ${visitor.visitorName}`}
          accessibilityRole="button"
        >
          <Text style={[styles.btnText, styles.rejectText]}>REJECT</Text>
        </TouchableOpacity>
      </View>

      {/* Call Guard link */}
      <TouchableOpacity
        onPress={onCallGuard}
        activeOpacity={0.7}
        style={styles.callGuardRow}
        accessibilityLabel="Call Guard"
        accessibilityRole="button"
      >
        <Text style={styles.callGuardText}>📞 Call Guard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: 10,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: colors.white, fontSize: 15, fontWeight: '700' },
  details: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  flat: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  btn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveBtn: { backgroundColor: colors.success },
  rejectBtn: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  disabledBtn: { opacity: 0.6 },
  btnText: { fontSize: 13, fontWeight: '700', color: colors.white, letterSpacing: 0.4 },
  rejectText: { color: colors.danger },
  callGuardRow: { alignItems: 'center' },
  callGuardText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
});
