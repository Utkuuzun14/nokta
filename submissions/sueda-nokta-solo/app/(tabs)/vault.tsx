import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { SavedAnalysis } from '@/lib/slop-storage';
import { getSavedAnalyses } from '@/lib/slop-storage';

export default function VaultScreen() {
  const [items, setItems] = useState<SavedAnalysis[]>([]);

  useFocusEffect(
    useCallback(() => {
      void getSavedAnalyses().then(setItems);
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Vault</Text>
        <Text style={styles.subHeader}>Kaydedilen analizler burada tutulur.</Text>

        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Henuz kayit yok</Text>
            <Text style={styles.emptyText}>
              Analyze sekmesinden bir fikir analiz edip vault&apos;a ekle.
            </Text>
          </View>
        ) : (
          items.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.push({ pathname: '/analysis-detail', params: { id: item.id } })}
              style={({ pressed }) => [styles.ideaCard, pressed && styles.ideaCardPressed]}>
              <View style={styles.ideaHeaderRow}>
                <Text numberOfLines={1} style={styles.ideaTitle}>
                  {item.ideaText}
                </Text>
                <Text style={styles.scorePill}>{item.result.slop_score}</Text>
              </View>
              <Text style={styles.ideaDate}>{new Date(item.createdAt).toLocaleString()}</Text>
              <Text numberOfLines={2} style={styles.ideaSummary}>
                {item.result.analysis}
              </Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0D14',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 34,
    gap: 12,
  },
  header: {
    color: '#F4F6FB',
    fontSize: 30,
    fontWeight: '700',
  },
  subHeader: {
    color: '#A8B4CF',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyCard: {
    marginTop: 10,
    backgroundColor: '#111726',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1A2336',
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    color: '#E8EEFF',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    color: '#A8B4CF',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  ideaCard: {
    marginTop: 10,
    backgroundColor: '#111726',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1A2336',
    padding: 14,
    gap: 6,
  },
  ideaCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  ideaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ideaTitle: {
    flex: 1,
    color: '#E8EEFF',
    fontSize: 15,
    fontWeight: '700',
  },
  scorePill: {
    color: '#FFE1E1',
    backgroundColor: '#3A171C',
    borderWidth: 1,
    borderColor: '#B94150',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
  },
  ideaDate: {
    color: '#8595BA',
    fontSize: 12,
  },
  ideaSummary: {
    color: '#BFCBE6',
    fontSize: 13,
    lineHeight: 18,
  },
});
