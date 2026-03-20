import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryCard } from '@/components/CategoryCard';
import { Colors } from '@/constants/colors';
import { QUESTION_SECTIONS } from '@/data';

export default function SectionSelectScreen() {
  const { category, categoryTitle } = useLocalSearchParams<{
    category: string;
    categoryTitle: string;
  }>();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backText}>← ተመለስ</Text>
        </Pressable>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>የጥያቄ ክፍል ይምረጡ</Text>
        <Text style={styles.subtitle}>
          ለመለማመድ የሚፈልጉትን ክፍል (A–E){'\n'}ይምረጡ
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.cards}
        showsVerticalScrollIndicator={false}
      >
        {QUESTION_SECTIONS.map((sec) => (
          <CategoryCard
            key={sec.id}
            title={`ክፍል ${sec.label}`}
            onPress={() =>
              router.push({
                pathname: '/question-setup',
                params: {
                  category: category ?? '',
                  categoryTitle: categoryTitle ?? '',
                  section: sec.id,
                },
              })
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EAF2FB',
    paddingHorizontal: 24,
  },
  topBar: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  backText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  header: {
    marginTop: 32,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1B3A5C',
  },
  subtitle: {
    fontSize: 15,
    color: '#5A7FA5',
    marginTop: 8,
    lineHeight: 22,
  },
  cards: {
    gap: 22,
    paddingBottom: 20,
    paddingLeft: 4,
  },
});
