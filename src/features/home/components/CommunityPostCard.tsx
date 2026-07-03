import React, { useCallback, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@theme/colors';
import spacing from '@theme/spacing';
import type { CommunityPost } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CONTENT_PREVIEW_LENGTH = 120;

// ─── Category icon background by category name ───────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Notice: '#FF8F00',
  Community: colors.primary,
  Event: '#00897B',
  Admin: colors.primaryDark,
  Default: colors.primaryLight,
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Default;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CommunityPostCardProps {
  post: CommunityPost;
  onMenuPress?: (postId: string) => void;
}

export const CommunityPostCard = React.memo<CommunityPostCardProps>(
  ({ post, onMenuPress }) => {
    const [expanded, setExpanded] = useState(false);

    const isLong = post.content.length > CONTENT_PREVIEW_LENGTH;
    const displayContent =
      expanded || !isLong
        ? post.content
        : post.content.slice(0, CONTENT_PREVIEW_LENGTH).trimEnd() + '...';

    const handleMenu = useCallback(() => {
      onMenuPress?.(post.postId);
    }, [onMenuPress, post.postId]);

    const toggleExpand = useCallback(() => setExpanded((v) => !v), []);

    const iconBg = getCategoryColor(post.category);
    const badgeCount = post.notificationCount ?? 0;

    return (
      <View style={styles.card}>
        {/* Header row */}
        <View style={styles.header}>
          {/* Left: category icon with optional badge */}
          <View style={styles.iconWrap}>
            <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
              <Ionicons name="notifications" size={18} color={colors.white} />
            </View>
            {badgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {badgeCount > 9 ? '9+' : badgeCount}
                </Text>
              </View>
            )}
          </View>

          {/* Middle: meta row */}
          <View style={styles.meta}>
            <View style={styles.metaRow}>
              <Text style={styles.category}>{post.category}</Text>

              {post.isAd && (
                <View style={styles.adPill}>
                  <Text style={styles.adPillText}>Ad</Text>
                </View>
              )}
              {post.isAdmin && (
                <View style={styles.adminPill}>
                  <Text style={styles.adminPillText}>Admin</Text>
                </View>
              )}
            </View>

            <Text style={styles.sourceTime} numberOfLines={1}>
              {post.source}
              {post.timestamp ? ` · ${post.timestamp}` : ''}
            </Text>
          </View>

          {/* Right: three-dot menu */}
          <TouchableOpacity
            onPress={handleMenu}
            style={styles.menuBtn}
            activeOpacity={0.6}
            accessibilityLabel="Post options"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Title */}
        {!!post.title && (
          <Text style={styles.title} numberOfLines={2}>
            {post.title}
          </Text>
        )}

        {/* Content */}
        <Text style={styles.content}>
          {displayContent}
          {isLong && !expanded && (
            <Text onPress={toggleExpand} style={styles.readMore}>
              {' '}Read more
            </Text>
          )}
          {isLong && expanded && (
            <Text onPress={toggleExpand} style={styles.readMore}>
              {' '}Show less
            </Text>
          )}
        </Text>

        {/* Attachment row */}
        {!!post.attachmentCount && post.attachmentCount > 0 && (
          <View style={styles.attachmentRow}>
            <Ionicons
              name="attach-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.attachmentText}>{post.attachmentCount}</Text>
          </View>
        )}

        {/* Optional image */}
        {!!post.image && (
          <Image
            source={{ uri: post.image }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: 10,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrap: {
    marginRight: 10,
    position: 'relative',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 12,
  },
  meta: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
  },
  category: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  adPill: {
    backgroundColor: colors.info + '18',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  adPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.info,
  },
  adminPill: {
    backgroundColor: colors.primaryDark,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  adminPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
  },
  sourceTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuBtn: {
    padding: 4,
    marginLeft: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: 5,
  },
  content: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  readMore: {
    color: colors.primary,
    fontWeight: '600',
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    backgroundColor: colors.background,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  attachmentText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  postImage: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginTop: 10,
  },
});
