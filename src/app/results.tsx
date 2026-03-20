import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScoreCircle } from '@/components/ScoreCircle';
import { Colors } from '@/constants/colors';
import { questions } from '@/data';

const OPTION_LETTERS = ['ሀ', 'ለ', 'ሐ', 'መ'];

type AnswerRecord = {
  questionId: number;
  selectedIndex: number;
};

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
    answers: answersRaw,
  } = useLocalSearchParams<{
    category: string;
    categoryTitle: string;
    section: string;
    score: string;
    total: string;
    timeUsed: string;
    answers: string;
  }>();

  const router = useRouter();
  const scoreNum = Number(score);
  const totalNum = Number(total);
  const timeUsedNum = Number(timeUsed);

  const answerRecords: AnswerRecord[] = useMemo(() => {
    try {
      return JSON.parse(answersRaw ?? '[]');
    } catch {
      return [];
    }
  }, [answersRaw]);

  const quizQuestions = useMemo(() => {
    return answerRecords
      .map((a) => questions.find((q) => q.id === a.questionId))
      .filter(Boolean) as (typeof questions)[number][];
  }, [answerRecords]);

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <ScoreCircle score={scoreNum} total={totalNum} />

      {timeUsedNum > 0 && (
        <Text style={styles.timeText}>
          የፈጀው ጊዜ: {formatDuration(timeUsedNum)}
        </Text>
      )}

      <View style={styles.reviewHeader}>
        {(categoryTitle || section) ? (
          <Text style={styles.reviewMeta}>
            {[categoryTitle, section ? `ክፍል ${section}` : ''].filter(Boolean).join(' · ')}
          </Text>
        ) : null}
        <Text style={styles.reviewTitle}>መልሶችን ይገምግሙ</Text>
      </View>
    </View>
  );

  const renderItem = ({ item, index }: { item: (typeof quizQuestions)[number]; index: number }) => {
    const record = answerRecords.find((a) => a.questionId === item.id);
    const userIndex = record?.selectedIndex ?? -1;
    const isCorrect = userIndex === item.correctAnswerIndex;

    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewQuestionRow}>
          <View
            style={[
              styles.reviewBadge,
              {
                backgroundColor: isCorrect
                  ? Colors.successLight
                  : Colors.errorLight,
              },
            ]}
          >
            <Text
              style={[
                styles.reviewBadgeText,
                { color: isCorrect ? Colors.success : Colors.error },
              ]}
            >
              {isCorrect ? '✓' : '✗'}
            </Text>
          </View>
          <Text style={styles.reviewQuestionNumber}>Q{index + 1}</Text>
        </View>
        <Text style={styles.reviewQuestionText}>{item.question}</Text>

        {!isCorrect && userIndex >= 0 && (
          <Text style={styles.yourAnswer}>
            የእርስዎ መልስ: {OPTION_LETTERS[userIndex]}.{' '}
            {item.options[userIndex]}
          </Text>
        )}
        <Text style={styles.correctAnswer}>
          ትክክል: {OPTION_LETTERS[item.correctAnswerIndex]}.{' '}
          {item.options[item.correctAnswerIndex]}
        </Text>

        <View style={styles.explanationBox}>
          <Text style={styles.explanationLabel}>ማብራሪያ</Text>
          <Text style={styles.explanationText}>{item.explanation}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={quizQuestions}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
      />

      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
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
          <Text style={styles.retryButtonText}>ድገም</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.homeButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.replace('/categories')}
        >
          <Text style={styles.homeButtonText}>መነሻ</Text>
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
  headerSection: {
    paddingTop: 32,
    paddingBottom: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  timeText: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  reviewHeader: {
    marginTop: 28,
    marginBottom: 16,
  },
  reviewMeta: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  reviewCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  reviewQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  reviewBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  reviewQuestionNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  reviewQuestionText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  yourAnswer: {
    fontSize: 13,
    color: Colors.error,
    marginBottom: 4,
  },
  correctAnswer: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '600',
    marginBottom: 10,
  },
  explanationBox: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
  },
  explanationLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 19,
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
