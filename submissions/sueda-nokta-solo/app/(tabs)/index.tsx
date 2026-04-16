import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { analyzeIdeaWithGemini } from '@/lib/gemini';
import { saveAnalysis } from '@/lib/slop-storage';

export default function AnalyzeScreen() {
  const [ideaText, setIdeaText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (typeof window !== 'undefined') {
      window.alert('FONKSIYON TETIKLENDI');
    }
    console.log('BUTONA BASILDI!');

    if (!ideaText.trim()) {
      Alert.alert('Fikir gerekli', 'Lutfen analiz etmek icin bir fikir metni gir.');
      return;
    }

    setIsLoading(true);
    const id = Date.now().toString();

    try {
      console.log('Gemini istegi basladi...');
      const result = await analyzeIdeaWithGemini(ideaText.trim());
      console.log('Gemini yaniti alindi.');

      await saveAnalysis({
        id,
        ideaText: ideaText.trim(),
        createdAt: new Date().toISOString(),
        result,
      });

      router.push('/(tabs)/vault');
    } catch (error) {
      console.error('Analyze akisi hatasi:', error);
      Alert.alert('Baglanti hatasi, lutfen tekrar deneyin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Nokta | Slop Detector</Text>
        <Text style={styles.subHeader}>Fikrini gir, acimasiz analiz sonucu yeni sayfada gelsin.</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>GIRISIM FIKRI</Text>
          <TextInput
            value={ideaText}
            onChangeText={setIdeaText}
            placeholder="Fikrini buraya yaz veya yapistir..."
            placeholderTextColor="#6D7484"
            multiline
            textAlignVertical="top"
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <Button
              title={isLoading ? 'Analiz Ediliyor...' : 'Acimasizca Analiz Et'}
              onPress={handleAnalyze}
              disabled={isLoading}
              color="#7A5AF8"
            />
          </View>
          {isLoading && (
            <View style={styles.loadingInline}>
              <ActivityIndicator size="small" color="#F7F8FF" />
              <Text style={styles.buttonText}>Gemini yaniti bekleniyor...</Text>
            </View>
          )}
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
    paddingHorizontal: 18,
    paddingTop: 16,
    gap: 12,
  },
  header: {
    color: '#F4F6FB',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subHeader: {
    color: '#A8B4CF',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    marginTop: 8,
    backgroundColor: '#111726',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1A2336',
    padding: 16,
    shadowColor: '#05070D',
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  sectionTitle: {
    color: '#C8D2EA',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    minHeight: 260,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#27344D',
    backgroundColor: '#0C1220',
    color: '#EAF0FF',
    fontSize: 15,
    lineHeight: 21,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  buttonContainer: {
    marginTop: 14,
  },
  buttonText: {
    color: '#F7F8FF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  loadingInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
