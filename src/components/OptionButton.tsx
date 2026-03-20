import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors } from '@/constants/colors';

type OptionState = 'default' | 'correct' | 'incorrect' | 'dimmed';

type Props = {
  label: string;
  optionLetter: string;
  state: OptionState;
  onPress: () => void;
  disabled: boolean;
};

const stateStyles: Record<OptionState, { bg: string; border: string; text: string; letterBg: string }> = {
  default: {
    bg: Colors.card,
    border: Colors.border,
    text: Colors.text,
    letterBg: Colors.primaryLight,
  },
  correct: {
    bg: Colors.successLight,
    border: Colors.success,
    text: Colors.text,
    letterBg: Colors.success,
  },
  incorrect: {
    bg: Colors.errorLight,
    border: Colors.error,
    text: Colors.text,
    letterBg: Colors.error,
  },
  dimmed: {
    bg: Colors.card,
    border: Colors.border,
    text: Colors.textLight,
    letterBg: Colors.border,
  },
};

export function OptionButton({ label, optionLetter, state, onPress, disabled }: Props) {
  const colors = stateStyles[state];
  const letterTextColor = state === 'correct' || state === 'incorrect' ? '#FFFFFF' : Colors.primary;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.bg, borderColor: colors.border },
        pressed && !disabled && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.letter, { backgroundColor: colors.letterBg, color: letterTextColor }]}>
        {optionLetter}
      </Text>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 14,
    minHeight: 56,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  letter: {
    width: 32,
    height: 32,
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 14,
    fontWeight: '700',
    overflow: 'hidden',
  },
  label: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 21,
  },
});
