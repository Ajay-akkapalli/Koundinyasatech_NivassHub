import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '@theme/colors';
import spacing from '@theme/spacing';

// ─── Types ────────────────────────────────────────────────────────────────────

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface SearchItem {
  id: string;
  title: string;
  icon: IoniconsName;
  iconBg: string;
  route?: string;
}

// ─── Popular Searches Data ────────────────────────────────────────────────────

const POPULAR_SEARCHES: SearchItem[] = [
  {
    id: 'daily-help',
    title: 'Daily Help',
    icon: 'person-outline',
    iconBg: colors.primary,
  },
  {
    id: 'amenities',
    title: 'Amenities',
    icon: 'fitness-outline',
    iconBg: '#00897B',
  },
  {
    id: 'society-dues',
    title: 'Society Dues',
    icon: 'card-outline',
    iconBg: '#E65100',
  },
  {
    id: 'visitor-preapprove',
    title: 'Visitor Pre-Approve',
    icon: 'person-add-outline',
    iconBg: '#6A1B9A',
  },
  {
    id: 'resident-directory',
    title: 'Resident Directory',
    icon: 'book-outline',
    iconBg: '#00695C',
  },
  {
    id: 'message-guard',
    title: 'Message Guard',
    icon: 'shield-checkmark-outline',
    iconBg: '#C62828',
  },
  {
    id: 'services',
    title: 'Services',
    icon: 'construct-outline',
    iconBg: '#FF6F00',
  },
  {
    id: 'complaints',
    title: 'Complaints',
    icon: 'warning-outline',
    iconBg: '#1565C0',
  },
];

// ─── Search Item Row ──────────────────────────────────────────────────────────

interface SearchItemRowProps {
  item: SearchItem;
  onPress: (item: SearchItem) => void;
}

const SearchItemRow = React.memo<SearchItemRowProps>(({ item, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 2,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  return (
    <Pressable
      onPress={() => onPress(item)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityLabel={item.title}
      accessibilityRole="button"
    >
      <Animated.View style={[rowStyles.row, { transform: [{ scale: scaleAnim }] }]}>
        {/* Circular icon */}
        <View style={[rowStyles.iconCircle, { backgroundColor: item.iconBg }]}>
          <Ionicons name={item.icon} size={18} color={colors.white} />
        </View>

        {/* Title */}
        <Text style={rowStyles.title}>{item.title}</Text>

        {/* Chevron */}
        <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
      </Animated.View>
    </Pressable>
  );
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: spacing.md,
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});

// ─── Search Screen ────────────────────────────────────────────────────────────

export const SearchScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [query, setQuery] = useState('');

  // Filtered items based on query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return POPULAR_SEARCHES;
    return POPULAR_SEARCHES.filter((item) =>
      item.title.toLowerCase().includes(q),
    );
  }, [query]);

  const handleBack = useCallback(() => {
    Keyboard.dismiss();
    router.back();
  }, [router]);

  const handleClear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  const handleItemPress = useCallback(
    (item: SearchItem) => {
      Keyboard.dismiss();
      if (item.route) {
        router.push(item.route as any);
      }
    },
    [router],
  );

  const ListHeader = useMemo(
    () => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {query.trim() ? 'Results' : 'Popular Searches'}
        </Text>
      </View>
    ),
    [query],
  );

  const ListEmpty = useMemo(
    () => (
      <View style={styles.emptyState}>
        <Ionicons name="search-outline" size={48} color={colors.textLight} />
        <Text style={styles.emptyTitle}>No results found</Text>
        <Text style={styles.emptySubtitle}>Try searching for something else</Text>
      </View>
    ),
    [],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Fixed search bar */}
      <View style={styles.searchBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <Ionicons name="search-outline" size={18} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Search..."
            placeholderTextColor={colors.textLight}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Search input"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearBtn}
              activeOpacity={0.7}
              accessibilityLabel="Clear search"
              accessibilityRole="button"
            >
              <Ionicons name="close-circle" size={18} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results list */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SearchItemRow item={item} onPress={handleItemPress} />
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={filteredItems.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 44,
    gap: 6,
  },
  searchIcon: { flexShrink: 0 },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 2,
  },
  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: colors.white,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textLight,
  },
  emptyContainer: {
    flexGrow: 1,
  },
});
