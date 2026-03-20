import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Pressable,
  Animated as RNAnimated,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";

export default function DownloadScreen() {
  const { category, categoryTitle } = useLocalSearchParams<{
    category: string;
    categoryTitle: string;
  }>();
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new RNAnimated.Value(0)).current;

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
          setTimeout(
            () =>
              router.replace({
                pathname: "/section-select",
                params: {
                  category: category ?? "",
                  categoryTitle: categoryTitle ?? "",
                },
              }),
            600,
          );
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
  }, [router, progressAnim, category, categoryTitle]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backText}>← ተመለስ</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {categoryTitle ?? category}
          </Text>
        </View>

        <Text style={styles.title}>ጥያቄዎችን ያውርዱ</Text>
        <Text style={styles.subtitle}>
          የ{categoryTitle ?? category} ፈተና ጥያቄዎችን{"\n"}ለመለማመድ ያውርዱ
        </Text>

        {downloading ? (
          <View style={styles.progressContainer}>
            <View style={styles.progressRow}>
              <View style={styles.progressBarBg}>
                <RNAnimated.View
                  style={[styles.progressBarFill, { width: progressWidth }]}
                />
              </View>
              <Text style={styles.progressPct}>{progress}%</Text>
            </View>
            <Text style={styles.progressLabel}>
              {progress < 100 ? "በማውረድ ላይ..." : "✓  ማውረዱ ተጠናቋል!"}
            </Text>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.downloadBtn,
              pressed && styles.downloadBtnPressed,
            ]}
            onPress={handleDownload}
          >
            <View style={styles.btnIconCircle}>
              <Text style={styles.btnIcon}>↓</Text>
            </View>
            <Text style={styles.btnLabel}>ጥያቄዎችን ያውርዱ</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
  },
  topBar: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  backText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },
  categoryBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
  },
  categoryBadgeText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 36,
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 12,
  },
  downloadBtnPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  btnIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  btnIcon: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "800",
  },
  btnLabel: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  progressContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: "rgba(26, 86, 219, 0.1)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  progressPct: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
    minWidth: 36,
    textAlign: "right",
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    textAlign: "center",
  },
  note: {
    marginTop: 28,
    color: Colors.textLight,
    fontSize: 13,
    textAlign: "center",
  },
});
