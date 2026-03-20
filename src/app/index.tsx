import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated as RNAnimated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';

const APP_LOGO = require('@/assets/images/appLogo.svg');

export default function DownloadScreen() {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new RNAnimated.Value(0)).current;

  const logoRotate = useSharedValue(0);
  const logoScale = useSharedValue(0.75);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 500 });
    logoScale.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.back(1.4)),
    });
    logoRotate.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(12, {
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(-12, {
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const handleDownload = useCallback(() => {
    setDownloading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setProgress(100);
        RNAnimated.timing(progressAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          setTimeout(() => router.replace('/categories'), 600);
        });
      } else {
        setProgress(Math.round(p));
        RNAnimated.timing(progressAnim, {
          toValue: p / 100,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    }, 300);
  }, [router, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Animated.View style={[styles.logoWrap, logoAnimatedStyle]}>
          <Image source={APP_LOGO} style={styles.logo} contentFit="contain" />
        </Animated.View>

        <Text style={styles.title}>
          የኢትዮጵያ መንጃ ፈቃድ{'\n'}ልምምድ
        </Text>
        <Text style={styles.subtitle}>
          ለመንጃ ፈቃድ ፈተና ለመለማመድ{'\n'}የጥያቄ ባንክ ያውርዱ
        </Text>

        {downloading ? (
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <RNAnimated.View
                style={[styles.progressBarFill, { width: progressWidth }]}
              />
            </View>
            <Text style={styles.progressText}>
              {progress < 100
                ? `በማውረድ ላይ... ${progress}%`
                : 'ማውረዱ ተጠናቋል!'}
            </Text>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.downloadButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleDownload}
          >
            <Text style={styles.downloadIcon}>↓</Text>
            <Text style={styles.downloadButtonText}>ዳታ ያውርዱ</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.footer}>
        ሁሉም ዳታ በመሣሪያዎ ላይ ይቀመጣል
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F3F4F4',
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrap: {
    marginBottom: 28,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
  },
  progressBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 36,
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  downloadIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    color: Colors.textLight,
    fontSize: 13,
    marginBottom: 20,
  },
});
