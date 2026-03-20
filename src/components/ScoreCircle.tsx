import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';

type Props = {
  score: number;
  total: number;
};

export function ScoreCircle({ score, total }: Props) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = percentage >= 70;
  const accentColor = passed ? Colors.success : Colors.error;
  const accentBg = passed ? Colors.successLight : Colors.errorLight;

  return (
    <View style={styles.container}>
      <View style={[styles.outerRing, { borderColor: accentColor }]}>
        <View style={[styles.innerCircle, { backgroundColor: accentBg }]}>
          <Text style={[styles.percentage, { color: accentColor }]}>{percentage}%</Text>
          <Text style={styles.fraction}>
            {score} / {total}
          </Text>
        </View>
      </View>
      <Text style={[styles.status, { color: accentColor }]}>
        {passed ? 'አልፈዋል!' : 'አላለፉም'}
      </Text>
      <Text style={styles.threshold}>ለማለፍ 70% ያስፈልጋል</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  outerRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 136,
    height: 136,
    borderRadius: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    fontSize: 36,
    fontWeight: '800',
  },
  fraction: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  status: {
    fontSize: 22,
    fontWeight: '700',
  },
  threshold: {
    fontSize: 13,
    color: Colors.textLight,
  },
});
