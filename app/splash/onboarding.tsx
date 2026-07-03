import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
  Dimensions,
  ImageBackground,
  Platform,
} from 'react-native';
import type { ViewToken } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '@theme/colors';

const { width: SW, height: SH } = Dimensions.get('window');
const ILLUS_H = Math.round(SH * 0.58);
const NAV_AREA_H = 88;

// ─── Slide metadata ───────────────────────────────────────────────────────────
interface SlideData {
  id: string;
  title: string;
  description: string;
}

const SLIDES: SlideData[] = [
  {
    id: '1',
    title: 'Your Society,\nSimplified',
    description: 'Everything you need to manage your society life — all in one beautiful, intuitive app.',
  },
  {
    id: '2',
    title: 'Pay Like\na Pro',
    description: 'Stay on top of maintenance dues, rent, and all society‑related charges with ease.',
  },
  {
    id: '3',
    title: "Know Who's\nat Your Door",
    description: "Manage visitors and deliveries seamlessly. Always know who's knocking.",
  },
  {
    id: '4',
    title: 'Stay Connected\nwith Community',
    description: 'Society announcements, important notices, and community updates — all in one place.',
  },
];

// Stable ref — must not be recreated on render
const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 50 };

// ─── Illustration: Slide 1 — Society (real building photo) ───────────────────
function SocietyIllustration() {
  return (
    <ImageBackground
      // Replace this image with your own society/lifestyle photo
      source={require('../../assets/images/Splash screen img.png')}
      style={i1.bg}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(26,35,126,0.55)', 'rgba(26,35,126,0.80)']}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={i1.body}>
        {/* Icon badge */}
        <View style={i1.iconRing}>
          <Ionicons name="business" size={52} color="#FFFFFF" />
        </View>

        {/* Stats row */}
        <View style={i1.statsRow}>
          <View style={i1.statCard}>
            <Text style={i1.statNum}>500+</Text>
            <Text style={i1.statLabel}>Societies</Text>
          </View>
          <View style={[i1.statCard, { borderColor: colors.splashAccent }]}>
            <Text style={[i1.statNum, { color: colors.splashAccent }]}>⭐ 4.8</Text>
            <Text style={i1.statLabel}>Rated</Text>
          </View>
          <View style={i1.statCard}>
            <Text style={i1.statNum}>2L+</Text>
            <Text style={i1.statLabel}>Residents</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

// ─── Illustration: Slide 2 — Payments ────────────────────────────────────────
function PaymentsIllustration() {
  return (
    <LinearGradient colors={['#004C99', '#0060BD']} style={i2.bg}>
      <View style={[i2.bgCircle, { width: 240, height: 240, borderRadius: 120, top: -50, right: -60 }]} />
      <View style={[i2.bgCircle, { width: 160, height: 160, borderRadius: 80, bottom: 20, left: -40 }]} />

      <View style={i2.body}>
        {/* Main payment card */}
        <View style={i2.card}>
          <View style={i2.cardHeader}>
            <View>
              <Text style={i2.cardBrand}>NivaasHub Pay</Text>
              <Text style={i2.cardSub}>Maintenance Due</Text>
            </View>
            <Ionicons name="card" size={22} color="rgba(255,255,255,0.85)" />
          </View>
          <Text style={i2.cardAmount}>₹ 2,850</Text>
          <View style={i2.cardFooter}>
            <Text style={i2.cardMuted}>**** 4823  ·  Aug 2026</Text>
            <View style={i2.paidBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#4CAF50" />
              <Text style={i2.paidText}> Paid</Text>
            </View>
          </View>
        </View>

        {/* Pending charge row */}
        <View style={i2.minCard}>
          <View style={i2.minCardLeft}>
            <View style={i2.pendingDot} />
            <View>
              <Text style={i2.minCardTitle}>Water Charge</Text>
              <Text style={i2.minCardSub}>Due by 10 Aug</Text>
            </View>
          </View>
          <Text style={i2.minCardAmt}>₹ 500</Text>
        </View>

        {/* Trend row */}
        <View style={i2.trendRow}>
          <Ionicons name="trending-up" size={14} color="rgba(76,175,80,0.9)" />
          <Text style={i2.trendText}>  Auto-debit enabled · Instant receipts</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

// ─── Illustration: Slide 3 — Visitors ────────────────────────────────────────
function VisitorsIllustration() {
  return (
    <LinearGradient colors={['#082B68', '#1A237E']} style={i3.bg}>
      <View style={[i3.bgCircle, { width: 220, height: 220, borderRadius: 110, top: -40, right: -55 }]} />
      <View style={[i3.bgCircle, { width: 150, height: 150, borderRadius: 75, bottom: 15, left: -35 }]} />

      <View style={i3.body}>
        {/* Visitor alert card */}
        <View style={i3.card}>
          <View style={i3.cardRow}>
            <View style={i3.avatar}>
              <Ionicons name="person" size={20} color={colors.primary} />
            </View>
            <View style={i3.cardMeta}>
              <Text style={i3.visitorName}>Rajan Kumar</Text>
              <Text style={i3.visitorTime}>Visitor · 3:45 PM · Gate 1</Text>
            </View>
            <View style={i3.bellBadge}>
              <Ionicons name="notifications" size={14} color={colors.primary} />
            </View>
          </View>
          <View style={i3.actionRow}>
            <TouchableOpacity style={i3.allowBtn} activeOpacity={0.8}>
              <Text style={i3.allowTxt}>Allow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={i3.denyBtn} activeOpacity={0.8}>
              <Text style={i3.denyTxt}>Deny</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery card */}
        <View style={[i3.card, { marginTop: 10, flexDirection: 'row', alignItems: 'center' }]}>
          <View style={[i3.avatar, { backgroundColor: 'rgba(243,176,91,0.15)' }]}>
            <Ionicons name="cube" size={18} color="#F3B05B" />
          </View>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={i3.visitorName}>Amazon Delivery</Text>
            <Text style={i3.visitorTime}>Package received · Gate 2 · 2:10 PM</Text>
          </View>
          <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
        </View>

        {/* Security badge */}
        <View style={i3.secBadge}>
          <Ionicons name="shield-checkmark" size={13} color="rgba(0,188,212,0.9)" />
          <Text style={i3.secText}>  Verified entries only</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

// ─── Illustration: Slide 4 — Community ───────────────────────────────────────
function CommunityIllustration() {
  const AVATAR_COLORS = ['#F3B05B', '#4CAF50', '#00BCD4', '#FF6F00'];

  return (
    <LinearGradient colors={['#1A237E', '#311B92']} style={i4.bg}>
      <View style={[i4.bgCircle, { width: 200, height: 200, borderRadius: 100, top: -40, left: -50 }]} />
      <View style={[i4.bgCircle, { width: 160, height: 160, borderRadius: 80, bottom: 10, right: -40 }]} />

      <View style={i4.body}>
        {/* Avatar row */}
        <View style={i4.avatarRow}>
          {AVATAR_COLORS.map((bg, i) => (
            <View key={i} style={[i4.avatar, { backgroundColor: bg, marginLeft: i > 0 ? -12 : 0, zIndex: 4 - i }]}>
              <Ionicons name="person" size={16} color="#FFFFFF" />
            </View>
          ))}
          <View style={[i4.avatar, { backgroundColor: 'rgba(255,255,255,0.18)', marginLeft: -12, zIndex: 0 }]}>
            <Text style={i4.avatarPlus}>+99</Text>
          </View>
          <Text style={i4.memberCount}>Members active</Text>
        </View>

        {/* Announcement card */}
        <View style={i4.card}>
          <View style={i4.cardHeader}>
            <View style={i4.newBadge}>
              <Text style={i4.newBadgeTxt}>NEW</Text>
            </View>
            <Text style={i4.cardTitle}>Community Notice</Text>
            <Text style={i4.cardTime}>2h ago</Text>
          </View>
          <Text style={i4.cardBody}>
            Water supply maintenance tomorrow{'\n'}6 AM – 10 AM. Please store water.
          </Text>
          <View style={i4.cardFooter}>
            <Ionicons name="person-circle" size={14} color="rgba(255,255,255,0.6)" />
            <Text style={i4.cardBy}>  Society Admin</Text>
          </View>
        </View>

        {/* Chat bubble row */}
        <View style={i4.chatRow}>
          <Ionicons name="chatbubbles" size={13} color="rgba(255,111,0,0.9)" />
          <Text style={i4.chatText}>  24 residents commented</Text>
          <Ionicons name="megaphone" size={13} color="rgba(255,255,255,0.55)" style={{ marginLeft: 12 }} />
          <Text style={[i4.chatText, { color: 'rgba(255,255,255,0.55)' }]}>  5 notices</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const ILLUSTRATIONS = [
  SocietyIllustration,
  PaymentsIllustration,
  VisitorsIllustration,
  CommunityIllustration,
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function OnboardingScreen(): React.JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<SlideData>>(null);

  const progressAnims = useRef(
    SLIDES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))
  ).current;

  const animateProgress = useCallback(
    (toIndex: number) => {
      progressAnims.forEach((anim, i) => {
        Animated.timing(anim, {
          toValue: i <= toIndex ? 1 : 0,
          duration: 260,
          useNativeDriver: false,
        }).start();
      });
    },
    [progressAnims]
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        const idx = viewableItems[0].index;
        setCurrentIndex(idx);
        animateProgress(idx);
      }
    },
    [animateProgress]
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<SlideData> | null | undefined, index: number) => ({
      length: SW,
      offset: SW * index,
      index,
    }),
    []
  );

  const goToNext = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      router.replace('/(auth)/mobile' as any);
    }
  }, [currentIndex, router]);

  const handleSkip = useCallback(() => {
    router.replace('/(auth)/mobile' as any);
  }, [router]);

  const isLastSlide = currentIndex === SLIDES.length - 1;

  const renderItem = useCallback(
    ({ item, index }: { item: SlideData; index: number }) => {
      const Illustration = ILLUSTRATIONS[index];
      return (
        <View style={styles.slideWrapper}>
          {/* Illustration area */}
          <View style={{ height: ILLUS_H, width: SW, overflow: 'hidden' }}>
            <Illustration />
          </View>

          {/* Text content */}
          <View style={[styles.contentArea, { paddingBottom: NAV_AREA_H + insets.bottom + 8 }]}>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideDesc}>{item.description}</Text>
          </View>
        </View>
      );
    },
    [insets.bottom]
  );

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        getItemLayout={getItemLayout}
        scrollEventThrottle={16}
        bounces={false}
        style={styles.flatList}
      />

      {/* Progress bars */}
      <View style={[styles.progressRow, { top: insets.top + 14 }]} pointerEvents="none">
        {SLIDES.map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.progressBar,
              {
                opacity: progressAnims[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.28, 1],
                }),
              },
            ]}
          />
        ))}
      </View>

      {/* Skip button */}
      {!isLastSlide && (
        <View style={[styles.skipWrapper, { top: insets.top + 8 }]}>
          <TouchableOpacity
            onPress={handleSkip}
            style={styles.skipBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.75}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom navigation */}
      <View style={[styles.navArea, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentIndex ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={goToNext} activeOpacity={0.82}>
          <Text style={styles.ctaText}>{isLastSlide ? 'Get Started' : 'Next'}</Text>
          {!isLastSlide && (
            <Ionicons name="arrow-forward" size={17} color={colors.white} style={{ marginLeft: 6 }} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Illustration stylesheets ─────────────────────────────────────────────────

// Slide 1 — Society
const i1 = StyleSheet.create({
  bg: { flex: 1, width: SW },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  iconRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statNum: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 2 },
  statLabel: { fontSize: 10, fontWeight: '500', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: 0.5 },
});

// Slide 2 — Payments
const i2 = StyleSheet.create({
  bg: { flex: 1, width: SW },
  bgCircle: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.06)' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 18,
    marginBottom: 0,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardBrand: { fontSize: 13, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 },
  cardSub: { fontSize: 11, color: 'rgba(255,255,255,0.55)' },
  cardAmount: { fontSize: 30, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardMuted: { fontSize: 11, color: 'rgba(255,255,255,0.50)' },
  paidBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(76,175,80,0.18)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  paidText: { fontSize: 11, fontWeight: '600', color: '#4CAF50' },
  minCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  minCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pendingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F3B05B' },
  minCardTitle: { fontSize: 13, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 },
  minCardSub: { fontSize: 11, color: 'rgba(255,255,255,0.50)' },
  minCardAmt: { fontSize: 15, fontWeight: '700', color: '#F3B05B' },
  trendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  trendText: { fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: '400' },
});

// Slide 3 — Visitors
const i3 = StyleSheet.create({
  bg: { flex: 1, width: SW },
  bgCircle: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.06)' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(26,35,126,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMeta: { flex: 1, marginLeft: 10 },
  visitorName: { fontSize: 14, fontWeight: '700', color: colors.brandDark, marginBottom: 2 },
  visitorTime: { fontSize: 11, color: colors.textSecondary },
  bellBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(26,35,126,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: { flexDirection: 'row', gap: 10 },
  allowBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  allowTxt: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  denyBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: 'rgba(244,67,54,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244,67,54,0.3)',
    alignItems: 'center',
  },
  denyTxt: { color: '#F44336', fontSize: 13, fontWeight: '600' },
  secBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    backgroundColor: 'rgba(0,188,212,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,188,212,0.25)',
  },
  secText: { color: 'rgba(0,188,212,0.9)', fontSize: 11, fontWeight: '500' },
});

// Slide 4 — Community
const i4 = StyleSheet.create({
  bg: { flex: 1, width: SW },
  bgCircle: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.06)' },
  body: { flex: 1, alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 24 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  avatarPlus: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  memberCount: { marginLeft: 12, fontSize: 12, color: 'rgba(255,255,255,0.60)', fontWeight: '500' },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: 16,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  newBadge: {
    backgroundColor: '#FF6F00',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newBadgeTxt: { color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  cardTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  cardTime: { fontSize: 11, color: 'rgba(255,255,255,0.45)' },
  cardBody: { fontSize: 13, color: 'rgba(255,255,255,0.80)', lineHeight: 20, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', alignItems: 'center' },
  cardBy: { fontSize: 11, color: 'rgba(255,255,255,0.50)' },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  chatText: { fontSize: 11, color: 'rgba(255,111,0,0.9)', fontWeight: '500' },
});

// ─── Main stylesheet ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  flatList: { flex: 1 },
  slideWrapper: { width: SW, flex: 1 },
  contentArea: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 28,
    paddingTop: 28,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.brandDark,
    lineHeight: 36,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  slideDesc: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 23,
  },

  // Progress bars
  progressRow: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 6,
  },
  progressBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },

  // Skip
  skipWrapper: { position: 'absolute', right: 20 },
  skipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  skipText: { color: '#FFFFFF', fontSize: 13, fontWeight: '500' },

  // Nav area
  navArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 12 },
    }),
  },
  dotsRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { height: 8, borderRadius: 4 },
  dotActive: { width: 24, backgroundColor: colors.primary },
  dotInactive: { width: 8, backgroundColor: colors.border },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  ctaText: { color: colors.white, fontSize: 15, fontWeight: '600', letterSpacing: 0.2 },
});
