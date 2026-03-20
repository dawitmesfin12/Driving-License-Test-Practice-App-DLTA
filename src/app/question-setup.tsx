import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { questions } from '@/data';

const QUESTION_COUNTS = [10, 30, 50] as const;

const TIME_MAP: Record<number, string> = {
  10: '5 ደቂቃ',
  30: '15 ደቂቃ',
  50: '25 ደቂቃ',
};

export default function QuestionSetupScreen() {
  const { category, categoryTitle, section } = useLocalSearchParams<{
    category: string;
    categoryTitle: string;
    section: string;
  }>();
  const router = useRouter();

  const availableCount = useMemo(
    () =>
      questions.filter(
        (q) => q.category === category && q.section === section,
      ).length,
    [category, section],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backText}>← ተመለስ</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.categoryLabel}>{categoryTitle ?? category}</Text>
          <Text style={styles.title}>ስንት ጥያቄዎች{'\n'}ይፈልጋሉ?</Text>
          <Text style={styles.subtitle}>
            ክፍል {section}: በዚህ ምድብ {availableCount} ጥያቄዎች አሉ
          </Text>
        </View>

        <View style={styles.options}>
          {QUESTION_COUNTS.map((count) => {
            const disabled = count > availableCount;
            return (
              <Pressable
                key={count}
                style={({ pressed }) => [
                  styles.optionCard,
                  disabled && styles.optionDisabled,
                  pressed && !disabled && styles.optionPressed,
                ]}
                disabled={disabled}
                onPress={() =>
                  router.push({
                    pathname: '/quiz',
                    params: {
                      category,
                      categoryTitle: categoryTitle ?? '',
                      section: section ?? '',
                      count: String(count),
                    },
                  })
                }
              >
                <Text
                  style={[
                    styles.optionCount,
                    disabled && styles.textDisabled,
                  ]}
                >
                  {count}
                </Text>
                <Text
                  style={[
                    styles.optionLabel,
                    disabled && styles.textDisabled,
                  ]}
                >
                  ጥያቄዎች
                </Text>
                <View
                  style={[
                    styles.timeBadge,
                    disabled && styles.timeBadgeDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.timeText,
                      disabled && styles.textDisabled,
                    ]}
                  >
                    {TIME_MAP[count]}
                  </Text>
                </View>
                {disabled && (
                  <Text style={styles.unavailableText}>በቂ ጥያቄዎች የሉም</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  topBar: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  backText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 60,
  },
  header: {
    marginBottom: 36,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  options: {
    gap: 14,
  },
  optionCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionPressed: {
    borderColor: Colors.primary,
    transform: [{ scale: 0.98 }],
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionCount: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    width: 60,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  timeBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timeBadgeDisabled: {
    backgroundColor: Colors.border,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  textDisabled: {
    color: Colors.textLight,
  },
  unavailableText: {
    position: 'absolute',
    bottom: 6,
    right: 22,
    fontSize: 11,
    color: Colors.textLight,
  },
});
