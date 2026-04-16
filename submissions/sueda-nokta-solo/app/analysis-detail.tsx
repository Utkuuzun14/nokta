import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { SavedAnalysis } from '@/lib/slop-storage';
import { getAnalysisById } from '@/lib/slop-storage';

export default function AnalysisDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [entry, setEntry] = useState<SavedAnalysis | null>(null);

  useEffect(() => {
    if (!id) return;
    void getAnalysisById(id).then(setEntry);
  }, [id]);

  const isDanger = useMemo(() => {
    if (!entry) return false;
    return entry.result.slop_score > 80;
  }, [entry]);

  if (!entry) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Analiz bulunamadi</Text>
          <Text style={styles.emptyText}>Vault kayitlarindan tekrar secim yapabilirsin.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getSeverityBadgeStyle = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return [styles.severityBadge, styles.severityBadgeCritical];
      case 'High':
        return [styles.severityBadge, styles.severityBadgeHigh];
      case 'Medium':
        return [styles.severityBadge, styles.severityBadgeMedium];
      default:
        return [styles.severityBadge, styles.severityBadgeDefault];
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Analysis Detail</Text>
        <Text style={styles.ideaText}>{entry.ideaText}</Text>

        <View style={[styles.card, styles.scoreCard, isDanger ? styles.dangerGlow : styles.safeGlow]}>
          <Text style={styles.sectionTitle}>Slop Score</Text>
          <Text style={[styles.scoreValue, isDanger ? styles.dangerText : styles.safeText]}>
            {entry.result.slop_score}/100
          </Text>
          <Text style={styles.analysisText}>{entry.result.analysis}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Kusurlar</Text>
          {entry.result.flaws.map((flaw, index) => (
            <View key={`${flaw.type}-${index}`} style={styles.flawCard}>
              <Text style={styles.flawType}>{flaw.type}</Text>
              <Text style={styles.flawSeverity}>Severity: {flaw.severity}</Text>
              <Text style={styles.flawDescription}>{flaw.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Muhendislik Terlemesi (Engineering Deep-Dive)</Text>
          <Text style={styles.deepDiveHint}>
            Bu sorular, fikrinin teknik belirsizliklerini ortaya cikarir ve MVP yol haritasini
            netlestirir.
          </Text>
          {entry.result.engineering_questions.map((item, index) => (
            <View key={`engineering-question-${index}`} style={styles.questionCard}>
              <View style={getSeverityBadgeStyle(item.severity)}>
                <Text style={styles.severityBadgeText}>{item.severity}</Text>
              </View>
              <View style={styles.questionBadge}>
                <Text style={styles.questionBadgeText}>{index + 1}</Text>
              </View>
              <View style={styles.questionBody}>
                <Text style={styles.questionText}>{item.question}</Text>
                <Text style={styles.questionWhyCritical}>{item.why_critical}</Text>
              </View>
            </View>
          ))}
        </View>
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
    paddingTop: 10,
    paddingBottom: 34,
    gap: 12,
  },
  header: {
    color: '#F4F6FB',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  ideaText: {
    color: '#A8B4CF',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#111726',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1A2336',
    padding: 16,
  },
  sectionTitle: {
    color: '#C8D2EA',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreCard: {
    borderWidth: 1.2,
  },
  dangerGlow: {
    borderColor: '#942F2F',
    backgroundColor: '#18111A',
  },
  safeGlow: {
    borderColor: '#1E7D4D',
    backgroundColor: '#101A15',
  },
  scoreValue: {
    fontSize: 42,
    fontWeight: '800',
    marginBottom: 8,
  },
  dangerText: {
    color: '#FF5D5D',
  },
  safeText: {
    color: '#39D98A',
  },
  analysisText: {
    color: '#DCE4F7',
    fontSize: 15,
    lineHeight: 22,
  },
  flawCard: {
    marginTop: 10,
    backgroundColor: '#28151A',
    borderLeftWidth: 4,
    borderLeftColor: '#FF7A66',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  flawType: {
    color: '#FFD9D4',
    fontSize: 15,
    fontWeight: '700',
  },
  flawSeverity: {
    marginTop: 3,
    color: '#FFB4A9',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  flawDescription: {
    marginTop: 7,
    color: '#F2C9C2',
    fontSize: 14,
    lineHeight: 20,
  },
  deepDiveHint: {
    color: '#B8C3DE',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  questionCard: {
    position: 'relative',
    marginTop: 10,
    backgroundColor: '#111E2E',
    borderWidth: 1,
    borderColor: '#2B3E5B',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  questionBody: {
    flex: 1,
    paddingRight: 68,
  },
  questionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2B4B78',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  questionBadgeText: {
    color: '#DCE9FF',
    fontSize: 12,
    fontWeight: '700',
  },
  questionText: {
    color: '#DCE5F8',
    fontSize: 14,
    lineHeight: 21,
  },
  questionWhyCritical: {
    marginTop: 6,
    color: '#A7B6D8',
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  severityBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
  },
  severityBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  severityBadgeCritical: {
    backgroundColor: '#3A171C',
    borderColor: '#B94150',
  },
  severityBadgeHigh: {
    backgroundColor: '#3B2513',
    borderColor: '#D07A2A',
  },
  severityBadgeMedium: {
    backgroundColor: '#2F2D15',
    borderColor: '#A58C31',
  },
  severityBadgeDefault: {
    backgroundColor: '#1F2D3F',
    borderColor: '#4E6C93',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    gap: 8,
  },
  emptyTitle: {
    color: '#E6EBFA',
    fontSize: 22,
    fontWeight: '700',
  },
  emptyText: {
    color: '#A8B4CF',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});
