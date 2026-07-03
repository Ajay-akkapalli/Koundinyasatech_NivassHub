import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getInitials } from '@utils/formatters';
import colors from '@theme/colors';
import spacing from '@theme/spacing';
import type { ApprovalVisitor } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.82;
const DISMISS_VELOCITY = 0.5;
const DISMISS_DISTANCE = SHEET_HEIGHT * 0.28;

// ─── Visitor Row ──────────────────────────────────────────────────────────────

interface VisitorRowProps {
  visitor: ApprovalVisitor;
  isProcessing: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onCallGuard: () => void;
}

const VisitorRow = React.memo<VisitorRowProps>(
  ({ visitor, isProcessing, onApprove, onReject, onCallGuard }) => {
    const initials = getInitials(visitor.visitorName);
    const visitorType = visitor.visitorType ?? 'Guest';
    const entryTime = visitor.entryTime ?? '--';

    return (
      <View style={rowStyles.card}>
        {/* Avatar + info */}
        <View style={rowStyles.infoRow}>
          <View style={rowStyles.avatar}>
            <Text style={rowStyles.avatarText}>{initials}</Text>
          </View>

          <View style={rowStyles.details}>
            <Text style={rowStyles.name} numberOfLines={1}>{visitor.visitorName}</Text>
            <View style={rowStyles.metaRow}>
              <View style={rowStyles.typePill}>
                <Text style={rowStyles.typeText}>{visitorType}</Text>
              </View>
              <Text style={rowStyles.metaDot}>·</Text>
              <Text style={rowStyles.metaText}>Unit {visitor.flat}</Text>
            </View>
          </View>

          <View style={rowStyles.timeCol}>
            <Ionicons name="time-outline" size={12} color={colors.textLight} />
            <Text style={rowStyles.timeText}>{entryTime}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={rowStyles.actions}>
          <TouchableOpacity
            style={[rowStyles.btn, rowStyles.approveBtn, isProcessing && rowStyles.disabledBtn]}
            onPress={() => onApprove(visitor.visitorId)}
            disabled={isProcessing}
            activeOpacity={0.8}
            accessibilityLabel={`Approve ${visitor.visitorName}`}
            accessibilityRole="button"
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <>
                <Ionicons name="checkmark-outline" size={14} color={colors.white} />
                <Text style={rowStyles.btnText}>Approve</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[rowStyles.btn, rowStyles.rejectBtn, isProcessing && rowStyles.disabledBtn]}
            onPress={() => onReject(visitor.visitorId)}
            disabled={isProcessing}
            activeOpacity={0.8}
            accessibilityLabel={`Reject ${visitor.visitorName}`}
            accessibilityRole="button"
          >
            <Ionicons name="close-outline" size={14} color={colors.danger} />
            <Text style={[rowStyles.btnText, rowStyles.rejectBtnText]}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={rowStyles.callBtn}
            onPress={onCallGuard}
            activeOpacity={0.7}
            accessibilityLabel="Call Guard"
            accessibilityRole="button"
          >
            <Ionicons name="call-outline" size={14} color={colors.primary} />
            <Text style={rowStyles.callText}>Guard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────

export interface ApprovalQueueBottomSheetProps {
  visible: boolean;
  items: ApprovalVisitor[];
  count: number;
  processingIds: string[];
  onApprove: (visitorId: string) => void;
  onReject: (visitorId: string) => void;
  onCallGuard: () => void;
  onClose: () => void;
}

export const ApprovalQueueBottomSheet: React.FC<ApprovalQueueBottomSheetProps> = ({
  visible,
  items,
  count,
  processingIds,
  onApprove,
  onReject,
  onCallGuard,
  onClose,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Keep latest close handler accessible from PanResponder (stable ref)
  const closeRef = useRef<() => void>(() => {});

  const animateClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SHEET_HEIGHT,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      onClose();
    });
  }, [translateY, backdropOpacity, onClose]);

  // Keep ref in sync so PanResponder can call latest version
  useEffect(() => {
    closeRef.current = animateClose;
  }, [animateClose]);

  // Trigger open
  useEffect(() => {
    if (visible) {
      translateY.setValue(SHEET_HEIGHT);
      backdropOpacity.setValue(0);
      setModalVisible(true);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 100,
          friction: 13,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.55,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, backdropOpacity]);

  // Swipe-to-dismiss via drag handle
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 4 && gs.dy > 0,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) {
          translateY.setValue(gs.dy);
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > DISMISS_DISTANCE || gs.vy > DISMISS_VELOCITY) {
          closeRef.current();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            bounciness: 6,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  if (!modalVisible) return null;

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={animateClose}
      statusBarTranslucent
    >
      {/* Dimmed backdrop */}
      <TouchableWithoutFeedback onPress={animateClose} accessible={false}>
        <Animated.View style={[sheetStyles.backdrop, { opacity: backdropOpacity }]} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View
        style={[sheetStyles.sheet, { transform: [{ translateY }] }]}
      >
        {/* Drag handle */}
        <View style={sheetStyles.handleArea} {...panResponder.panHandlers}>
          <View style={sheetStyles.handle} />
        </View>

        {/* Header */}
        <View style={sheetStyles.header}>
          <View style={sheetStyles.titleRow}>
            <Text style={sheetStyles.title}>Approval Queue</Text>
            {count > 0 && (
              <View style={sheetStyles.badge}>
                <Text style={sheetStyles.badgeText}>{count}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={animateClose}
            style={sheetStyles.closeBtn}
            activeOpacity={0.7}
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={sheetStyles.divider} />

        {/* Visitor list */}
        {items.length === 0 ? (
          <View style={sheetStyles.empty}>
            <Ionicons name="checkmark-circle" size={56} color={colors.success} />
            <Text style={sheetStyles.emptyTitle}>All Clear!</Text>
            <Text style={sheetStyles.emptySubtitle}>No pending visitors at this time.</Text>
          </View>
        ) : (
          <ScrollView
            style={sheetStyles.list}
            contentContainerStyle={sheetStyles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {items.map((visitor) => (
              <VisitorRow
                key={visitor.visitorId}
                visitor={visitor}
                isProcessing={processingIds.includes(visitor.visitorId)}
                onApprove={onApprove}
                onReject={onReject}
                onCallGuard={onCallGuard}
              />
            ))}
            <View style={sheetStyles.listBottom} />
          </ScrollView>
        )}
      </Animated.View>
    </Modal>
  );
};

// ─── Row Styles ───────────────────────────────────────────────────────────────

const rowStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  details: { flex: 1 },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  typePill: {
    backgroundColor: colors.primary + '18',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  metaDot: {
    fontSize: 12,
    color: colors.textLight,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  timeCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  timeText: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  approveBtn: {
    backgroundColor: colors.success,
  },
  rejectBtn: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  callBtn: {
    width: 64,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  disabledBtn: { opacity: 0.55 },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.2,
  },
  rejectBtnText: {
    color: colors.danger,
  },
  callText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
});

// ─── Sheet Styles ─────────────────────────────────────────────────────────────

const sheetStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    elevation: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  handleArea: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border + '60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
    marginBottom: 8,
  },
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: 8,
  },
  listBottom: { height: 32 },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
