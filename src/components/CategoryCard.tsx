import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
};

export function CategoryCard({ title, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.banner, pressed && styles.bannerPressed]}
      onPress={onPress}
    >
      <Text style={styles.title}>{title}</Text>
      <View style={styles.foldShadow} />
      <View style={styles.fold} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#5B93D3',
    borderRadius: 6,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  bannerPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  fold: {
    position: 'absolute',
    right: 0,
    bottom: -10,
    width: 14,
    height: 10,
    backgroundColor: '#3D6FA0',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 2,
  },
  foldShadow: {
    position: 'absolute',
    right: 0,
    bottom: -6,
    width: 14,
    height: 8,
    backgroundColor: '#2C5580',
    borderBottomLeftRadius: 8,
  },
});
