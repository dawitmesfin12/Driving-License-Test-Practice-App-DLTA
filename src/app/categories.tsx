import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryCard } from '@/components/CategoryCard';
import { categories } from '@/data';

export default function CategoriesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>የፈቃድ ዓይነት ይምረጡ</Text>
        <Text style={styles.subtitle}>
          ለመለማመድ የሚፈልጉትን{'\n'}የመንጃ ፈቃድ ዓይነት ይምረጡ
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.cards}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            title={cat.title}
            onPress={() =>
              router.push({
                pathname: '/download',
                params: { category: cat.id, categoryTitle: cat.title },
              })
            }
          />
        ))}
      </ScrollView>

      <Text style={styles.footer}>ልምምድ ፍጹም ያደርጋል — መልካም ዕድል!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EAF2FB',
    paddingHorizontal: 24,
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
  footer: {
    textAlign: 'center',
    color: '#8BACC8',
    fontSize: 13,
    marginBottom: 16,
  },
});
