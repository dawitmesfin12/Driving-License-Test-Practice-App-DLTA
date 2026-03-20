import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const APP_LOGO = require("@/assets/images/appLogo.png");
const ETHIOPIA_FLAG = require("@/assets/images/ethiopia-flag.svg");

const { width: SCREEN_W } = Dimensions.get("window");
const GLOW_SIZE = 160;
const STACK_OFFSET = 11;

export default function LandingScreen() {
  const router = useRouter();

  const logoScale = useSharedValue(0.55);
  const logoOpacity = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const glowScale = useSharedValue(0.7);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    glowOpacity.value = withTiming(1, { duration: 700 });
    glowScale.value = withTiming(1, {
      duration: 1100,
      easing: Easing.out(Easing.back(1.15)),
    });

    logoOpacity.value = withDelay(250, withTiming(1, { duration: 500 }));
    logoScale.value = withDelay(
      250,
      withTiming(1, {
        duration: 900,
        easing: Easing.out(Easing.back(1.4)),
      }),
    );

    logoRotate.value = withDelay(
      900,
      withRepeat(
        withSequence(
          withTiming(8, {
            duration: 2400,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(-8, {
            duration: 2400,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  return (
    <View style={styles.root}>
      <View style={styles.bgBlobTopRight} />
      <View style={styles.bgBlobBottomLeft} />

      <View style={styles.accentStrip}>
        <View style={[styles.accentBar, { backgroundColor: "#078930" }]} />
        <View style={[styles.accentBar, { backgroundColor: "#FCDD09" }]} />
        <View style={[styles.accentBar, { backgroundColor: "#DA121A" }]} />
      </View>

      <SafeAreaView style={styles.safe} edges={["bottom", "left", "right"]}>
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(100).duration(600)}>
            <Image
              source={ETHIOPIA_FLAG}
              style={styles.flagBadge}
              contentFit="contain"
              accessibilityLabel="Ethiopian flag"
            />
          </Animated.View>

          <View style={styles.logoArea}>
            <Animated.View style={[styles.glow, glowStyle]} />
            <Animated.View style={[styles.logoWrap, logoStyle]}>
              <Image
                source={APP_LOGO}
                style={styles.logo}
                contentFit="contain"
              />
            </Animated.View>
          </View>

          <Animated.View
            entering={FadeInUp.delay(400).duration(700)}
            style={styles.cardStack}
          >
            <View style={[styles.stackLayer, styles.layer3]} />
            <View style={[styles.stackLayer, styles.layer2]} />
            <View style={[styles.stackLayer, styles.layer1]} />
            <View style={styles.frontCard}>
              <Text style={styles.title}>
                የኢትዮጵያ መንጃ ፈቃድ{"\n"}ፈተና ልምምድ
              </Text>
              <View style={styles.divider} />
              <Text style={styles.subtitle}>
                የመንጃ ፈቃድ ፈተና ለመለማመድ{"\n"}የፈቃድ ዓይነትዎን ይምረጡ
              </Text>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(650).duration(600)}
            style={styles.ctaArea}
          >
            <Pressable
              style={({ pressed }) => [
                styles.ctaBtn,
                pressed && styles.ctaBtnPressed,
              ]}
              onPress={() => router.push("/categories")}
            >
              <Text style={styles.ctaLabel}>የፈቃድ ዓይነት ይምረጡ</Text>
              <Text style={styles.ctaArrow}>→</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  bgBlobTopRight: {
    position: "absolute",
    top: -SCREEN_W * 0.32,
    right: -SCREEN_W * 0.28,
    width: SCREEN_W * 0.85,
    height: SCREEN_W * 0.85,
    borderRadius: SCREEN_W * 0.43,
    backgroundColor: "rgba(7, 137, 48, 0.05)",
  },
  bgBlobBottomLeft: {
    position: "absolute",
    bottom: -SCREEN_W * 0.25,
    left: -SCREEN_W * 0.3,
    width: SCREEN_W * 0.75,
    height: SCREEN_W * 0.75,
    borderRadius: SCREEN_W * 0.38,
    backgroundColor: "rgba(218, 18, 26, 0.035)",
  },
  accentStrip: {
    flexDirection: "row",
    height: 5,
  },
  accentBar: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 28,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
  },
  flagBadge: {
    width: 68,
    height: 40,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.08)",
  },
  logoArea: {
    alignItems: "center",
    justifyContent: "center",
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    marginBottom: 28,
  },
  glow: {
    position: "absolute",
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
    backgroundColor: "rgba(26, 86, 219, 0.07)",
  },
  logoWrap: {
    width: 100,
    height: 100,
  },
  logo: {
    width: 100,
    height: 100,
  },
  cardStack: {
    width: "100%",
    marginBottom: STACK_OFFSET * 3 + 36,
  },
  stackLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  layer3: {
    backgroundColor: "#86EFAC",
    transform: [{ translateY: STACK_OFFSET * 3 }],
    zIndex: 1,
  },
  layer2: {
    backgroundColor: "#FDE68A",
    transform: [{ translateY: STACK_OFFSET * 2 }],
    zIndex: 2,
  },
  layer1: {
    backgroundColor: "#93C5FD",
    transform: [{ translateY: STACK_OFFSET }],
    zIndex: 3,
  },
  frontCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 26,
    alignItems: "center",
    zIndex: 4,
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1B2B44",
    textAlign: "center",
    lineHeight: 37,
    letterSpacing: 0.2,
  },
  divider: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#FCDD09",
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#6E829B",
    textAlign: "center",
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  ctaArea: {
    width: "100%",
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#1A56DB",
    borderRadius: 16,
    paddingVertical: 18,
    gap: 10,
    shadowColor: "#1A56DB",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 12,
  },
  ctaBtnPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  ctaLabel: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  ctaArrow: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },
});
