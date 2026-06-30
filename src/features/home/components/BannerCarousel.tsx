import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Linking } from 'react-native';
import colors from '@theme/colors';
import spacing from '@theme/spacing';
import type { HomeBanner } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - spacing.md * 2;

interface BannerCarouselProps {
  banners: HomeBanner[];
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
    setActiveIndex(index);
  };

  const handlePress = async (banner: HomeBanner) => {
    if (banner.redirectUrl) {
      const supported = await Linking.canOpenURL(banner.redirectUrl);
      if (supported) Linking.openURL(banner.redirectUrl);
    }
  };

  if (!banners.length) return null;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        snapToInterval={BANNER_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scroll}
      >
        {banners.map((banner) => (
          <TouchableOpacity
            key={banner.bannerId}
            activeOpacity={banner.redirectUrl ? 0.85 : 1}
            onPress={() => handlePress(banner)}
            style={styles.slide}
          >
            {banner.image ? (
              <Image
                source={{ uri: banner.image }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>{banner.title}</Text>
              </View>
            )}
            <View style={styles.overlay}>
              <Text style={styles.title}>{banner.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {banners.length > 1 && (
        <View style={styles.dots}>
          {banners.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  scroll: { gap: spacing.sm },
  slide: {
    width: BANNER_WIDTH,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.primaryLight,
  },
  image: { width: '100%', height: '100%' },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  placeholderText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  title: { color: colors.white, fontSize: 15, fontWeight: '700', textShadowColor: '#000', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 8, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { width: 18, backgroundColor: colors.primary },
});
