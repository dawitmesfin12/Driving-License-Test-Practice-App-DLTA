import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OptionButton } from '@/components/OptionButton';
import { ProgressBar } from '@/components/ProgressBar';
import { Colors } from '@/constants/colors';
import { questions, type Question } from '@/data';

const OPTION_LETTERS = ['ሀ', 'ለ', 'ሐ', 'መ'];

const TIME_PER_COUNT: Record<number, number> = {
  10: 300,
  30: 900,
  50: 1500,
};

type AnswerRecord = {
  questionId: number;
  selectedIndex: number;
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizScreen() {
  const { category, count, section, categoryTitle } = useLocalSearchParams<{
    category: string;
    count: string;
    section: string;
    categoryTitle: string;
  }>();
  const router = useRouter();
  const questionCount = Number(count) || 10;

  const quizQuestions = useMemo(() => {
    const filtered = questions.filter(
      (q) => q.category === category && q.section === section,
    );
    return shuffleArray(filtered).slice(0, questionCount);
  }, [category, section, questionCount]);

  const totalSeconds = TIME_PER_COUNT[questionCount] ?? questionCount * 30;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishedRef = useRef(false);
  const scrollRef = useRef<ScrollView>(null);

  const currentQuestion: Question | undefined = quizQuestions[currentIndex];
  const isLastQuestion = currentIndex === quizQuestions.length - 1;
  const hasAnswered = selectedAnswer !== null;

  const finishQuiz = useCallback(
    (finalAnswers: AnswerRecord[]) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);

      const score = finalAnswers.reduce((acc, a) => {
        const q = quizQuestions.find((q) => q.id === a.questionId);
        return acc + (q && a.selectedIndex === q.correctAnswerIndex ? 1 : 0);
      }, 0);

      const elapsed = totalSeconds - timeLeft;

      router.replace({
        pathname: '/results',
        params: {
          category: category ?? '',
          categoryTitle: categoryTitle ?? '',
          section: section ?? '',
          score: String(score),
          total: String(quizQuestions.length),
          timeUsed: String(elapsed),
          answers: JSON.stringify(finalAnswers),
        },
      });
    },
    [quizQuestions, category, categoryTitle, section, router, totalSeconds, timeLeft],
  );

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !finishedRef.current) {
      finishQuiz(answers);
    }
  }, [timeLeft, answers, finishQuiz]);

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (hasAnswered || !currentQuestion) return;
      setSelectedAnswer(optionIndex);
      setAnswers((prev) => [
        ...prev,
        { questionId: currentQuestion.id, selectedIndex: optionIndex },
      ]);
    },
    [hasAnswered, currentQuestion],
  );

  const handleShowExplanation = useCallback(() => {
    setShowExplanation(true);
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      finishQuiz(answers);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [isLastQuestion, answers, finishQuiz]);

  const getOptionState = (optionIndex: number) => {
    if (!hasAnswered) return 'default' as const;
    if (optionIndex === currentQuestion?.correctAnswerIndex)
      return 'correct' as const;
    if (optionIndex === selectedAnswer) return 'incorrect' as const;
    return 'dimmed' as const;
  };

  const timerDanger = timeLeft < 60;
  const timerWarning = timeLeft < 120 && !timerDanger;

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.errorText}>
          ለዚህ ምድብ ጥያቄዎች አልተገኙም።
        </Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>ተመለስ</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <View style={styles.progressWrapper}>
          <ProgressBar
            current={currentIndex + 1}
            total={quizQuestions.length}
          />
        </View>
        <View
          style={[
            styles.timerBadge,
            timerWarning && styles.timerWarning,
            timerDanger && styles.timerDanger,
          ]}
        >
          <Text
            style={[
              styles.timerText,
              timerWarning && styles.timerTextWarning,
              timerDanger && styles.timerTextDanger,
            ]}
          >
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          key={currentQuestion.id}
          entering={FadeInRight.duration(250)}
          exiting={FadeOutLeft.duration(200)}
        >
          <View style={styles.questionCard}>
            <Text style={styles.questionLabel}>
              ጥያቄ {currentIndex + 1}
            </Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>

          <View style={styles.options}>
            {currentQuestion.options.map((option, idx) => (
              <OptionButton
                key={idx}
                label={option}
                optionLetter={OPTION_LETTERS[idx]}
                state={getOptionState(idx)}
                onPress={() => handleSelect(idx)}
                disabled={hasAnswered}
              />
            ))}
          </View>

          {hasAnswered && !showExplanation && (
            <Animated.View entering={FadeInDown.duration(200)}>
              <Pressable
                style={({ pressed }) => [
                  styles.explanationButton,
                  pressed && styles.explanationButtonPressed,
                ]}
                onPress={handleShowExplanation}
              >
                <Text style={styles.explanationButtonText}>
                  ማብራሪያ ይመልከቱ
                </Text>
              </Pressable>
            </Animated.View>
          )}

          {hasAnswered && showExplanation && (
            <Animated.View
              entering={FadeInDown.duration(250)}
              style={styles.explanationCard}
            >
              <View style={styles.feedbackRow}>
                <View
                  style={[
                    styles.feedbackBadge,
                    {
                      backgroundColor:
                        selectedAnswer === currentQuestion.correctAnswerIndex
                          ? Colors.successLight
                          : Colors.errorLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.feedbackIcon,
                      {
                        color:
                          selectedAnswer === currentQuestion.correctAnswerIndex
                            ? Colors.success
                            : Colors.error,
                      },
                    ]}
                  >
                    {selectedAnswer === currentQuestion.correctAnswerIndex
                      ? '✓'
                      : '✗'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.feedbackText,
                    {
                      color:
                        selectedAnswer === currentQuestion.correctAnswerIndex
                          ? Colors.success
                          : Colors.error,
                    },
                  ]}
                >
                  {selectedAnswer === currentQuestion.correctAnswerIndex
                    ? 'ትክክል!'
                    : `ስህተት — መልሱ ${OPTION_LETTERS[currentQuestion.correctAnswerIndex]} ነው`}
                </Text>
              </View>

              <Text style={styles.explanationLabel}>ማብራሪያ</Text>
              <Text style={styles.explanationText}>
                {currentQuestion.explanation}
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>

      {hasAnswered && (
        <Animated.View entering={FadeInDown.duration(200)} style={styles.bottomBar}>
          <Pressable
            style={({ pressed }) => [
              styles.nextButton,
              pressed && styles.nextButtonPressed,
            ]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'ውጤት ይመልከቱ' : 'ቀጣይ ጥያቄ'}
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  closeText: {
    fontSize: 22,
    color: Colors.textSecondary,
    fontWeight: '300',
  },
  progressWrapper: {
    flex: 1,
  },
  timerBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  timerWarning: {
    backgroundColor: Colors.warningLight,
  },
  timerDanger: {
    backgroundColor: Colors.errorLight,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    fontVariant: ['tabular-nums'],
  },
  timerTextWarning: {
    color: Colors.warning,
  },
  timerTextDanger: {
    color: Colors.error,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  questionCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  questionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 25,
  },
  options: {
    gap: 10,
  },
  explanationButton: {
    marginTop: 16,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  explanationButtonPressed: {
    opacity: 0.85,
  },
  explanationButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  explanationCard: {
    marginTop: 16,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  feedbackBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackIcon: {
    fontSize: 16,
    fontWeight: '700',
  },
  feedbackText: {
    fontSize: 15,
    fontWeight: '700',
  },
  explanationLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  explanationText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 10,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonPressed: {
    opacity: 0.9,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
  backButton: {
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
