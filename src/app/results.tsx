import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScoreCircle } from '@/components/ScoreCircle';
import { Colors } from '@/constants/colors';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s} ሰከንድ`;
  return `${m} ደቂቃ ${s} ሰከንድ`;
}

export default function ResultsScreen() {
  const {
    category,
    categoryTitle,
    section,
    score,
    total,
    timeUsed,
  } = useLocalSearchParams<{
    category: string;
    categoryTitle: string;
    section: string;
    score: string;
    total: string;
    timeUsed: string;
  }>();

  const router = useRouter();
  const scoreNum = Number(score);
  const totalNum = Number(total);
  const timeUsedNum = Number(timeUsed);
  const passed = totalNum > 0 && scoreNum / totalNum >= 0.7;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <ScoreCircle score={scoreNum} total={totalNum} />

        <View style={styles.feedbackBadge}>
          <Text
            style={[
              styles.feedbackText,
              { color: passed ? Colors.success : Colors.error },
            ]}
          >
            {passed ? '🎉  አልፈዋል!' : 'ደግመው ይሞክሩ'}
          </Text>
        </View>

        {timeUsedNum > 0 && (
          <Text style={styles.timeText}>
            የፈጀው ጊዜ: {formatDuration(timeUsedNum)}
          </Text>
        )}

        {(categoryTitle || section) && (
          <Text style={styles.metaText}>
            {[categoryTitle, section ? `ክፍል ${section}` : '']
              .filter(Boolean)
              .join(' · ')}
          </Text>
        )}
      </View>

      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() =>
            router.replace({
              pathname: '/section-select',
              params: {
                category: category ?? '',
                categoryTitle: categoryTitle ?? '',
              },
            })
          }
        >
          <Text style={styles.retryButtonText}>ክፍል ይምረጡ</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.homeButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() =>
            router.replace({
              pathname: '/question-setup',
              params: {
                category: category ?? '',
                categoryTitle: categoryTitle ?? '',
                section: section ?? '',
              },
            })
          }
        >
          <Text style={styles.homeButtonText}>እንደገና ሞክር</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  feedbackBadge: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.card,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  timeText: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  metaText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
    marginTop: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 30,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.card,
  },
  retryButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  homeButton: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  homeButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
