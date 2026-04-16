import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Explore</Text>
        <View style={styles.card}>
          <Text style={styles.title}>Nokta Fikir Pazari</Text>
          <Text style={styles.description}>
            Bu alan, trend fikir sinyallerini ve topluluk geri bildirimlerini gezmek icin ayrildi.
            Simdilik odak Track B: Slop Detector ve teknik risk analizi.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0D14',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 12,
  },
  header: {
    color: '#F4F6FB',
    fontSize: 30,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#111726',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1A2336',
    padding: 16,
  },
  title: {
    color: '#E8EEFF',
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    marginTop: 8,
    color: '#A8B4CF',
    fontSize: 14,
    lineHeight: 20,
  },
});
