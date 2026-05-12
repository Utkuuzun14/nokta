import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EXPERTS, renderStars } from '@/constants/experts';
import { colors, fontSize, radius, spacing, typography } from '@/constants/theme';
import { updateSessionExpertReview } from '@/services/storage';

export default function ExpertReview() {
  const { sid, expertId } = useLocalSearchParams<{ sid: string; expertId: string }>();
  const [status, setStatus] = useState<'loading' | 'done'>('loading');

  const expert = EXPERTS.find((e) => e.id === expertId);

  useEffect(() => {
    if (!sid || !expert) return;

    void updateSessionExpertReview(sid, {
      expertId: expert.id,
      expertName: expert.name,
      requestedAt: Date.now(),
      status: 'pending',
    });

    const timer = setTimeout(async () => {
      await updateSessionExpertReview(sid, {
        expertId: expert.id,
        expertName: expert.name,
        requestedAt: Date.now(),
        status: 'reviewed',
        comment: expert.mockReview.comment,
        rating: expert.mockReview.rating,
        verdict: expert.mockReview.verdict,
        reviewedAt: Date.now(),
      });
      setStatus('done');
    }, 2000);

    return () => clearTimeout(timer);
  }, [sid, expert]);

  if (!expert) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Text style={styles.errorText}>Uzman bulunamadı.</Text>
      </SafeAreaView>
    );
  }

  const verdict = expert.mockReview.verdict;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Uzman Görüşü</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.expertCard}>
          <Text style={styles.avatar}>{expert.avatar}</Text>
          <View style={styles.expertInfo}>
            <Text style={styles.expertName}>{expert.name}</Text>
            <Text style={styles.expertField}>{expert.field}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.stars}>{renderStars(expert.rating)}</Text>
              <Text style={styles.ratingNum}>{expert.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        {status === 'loading' ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} size="small" />
            <Text style={styles.loadingText}>
              {expert.name} spec'ini inceliyor...
            </Text>
          </View>
        ) : (
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View
                style={[
                  styles.verdictBadge,
                  verdict === 'onay' ? styles.verdictOnay : styles.verdictRevize,
                ]}
              >
                <Text
                  style={[
                    styles.verdictText,
                    verdict === 'onay' ? styles.verdictTextOnay : styles.verdictTextRevize,
                  ]}
                >
                  {verdict === 'onay' ? '✓ Onaylandı' : '⚠ Revize Gerekli'}
                </Text>
              </View>
              <View style={styles.reviewRatingRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.reviewStar,
                      i < expert.mockReview.rating
                        ? styles.reviewStarFull
                        : styles.reviewStarEmpty,
                    ]}
                  >
                    ★
                  </Text>
                ))}
              </View>
            </View>

            <Text style={styles.reviewComment}>{expert.mockReview.comment}</Text>
          </View>
        )}

        {status === 'done' && (
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backToSpec, pressed && styles.backToSpecPressed]}
          >
            <Text style={styles.backToSpecText}>Spec'e Dön</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { paddingVertical: spacing.xs, minWidth: 60 },
  backText: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  headerTitle: {
    fontFamily: typography.headline,
    fontSize: fontSize.base,
    color: colors.text,
    fontWeight: '700',
  },
  headerSpacer: { minWidth: 60 },
  body: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  expertCard: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  avatar: { fontSize: 40 },
  expertInfo: { flex: 1, gap: spacing.xs },
  expertName: {
    fontFamily: typography.headline,
    fontSize: fontSize.base,
    color: colors.text,
    fontWeight: '700',
  },
  expertField: {
    fontFamily: typography.bodyMedium,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  stars: { fontSize: fontSize.sm, color: colors.warn },
  ratingNum: {
    fontFamily: typography.bodySemi,
    fontSize: fontSize.sm,
    color: colors.text,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: typography.body,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verdictBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  verdictOnay: {
    backgroundColor: '#0D2818',
    borderColor: colors.success,
  },
  verdictRevize: {
    backgroundColor: '#2A1F00',
    borderColor: colors.warn,
  },
  verdictText: {
    fontFamily: typography.bodySemi,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  verdictTextOnay: { color: colors.success },
  verdictTextRevize: { color: colors.warn },
  reviewRatingRow: { flexDirection: 'row', gap: 2 },
  reviewStar: { fontSize: fontSize.lg },
  reviewStarFull: { color: colors.warn },
  reviewStarEmpty: { color: colors.textDim },
  reviewComment: {
    fontFamily: typography.body,
    fontSize: fontSize.base,
    color: colors.text,
    lineHeight: 24,
  },
  backToSpec: {
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  backToSpecPressed: { opacity: 0.85 },
  backToSpecText: {
    fontFamily: typography.bodySemi,
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '600',
  },
  errorText: {
    color: colors.danger,
    padding: spacing.lg,
    fontFamily: typography.body,
    fontSize: fontSize.base,
  },
});
