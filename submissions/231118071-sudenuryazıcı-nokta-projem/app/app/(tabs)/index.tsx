import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function TabOneScreen() {
  const [idea, setIdea] = React.useState('');

  return (
    <View style={styles.container}>
      {/* Background Accent */}
      <RNView style={styles.glow} />

      <View style={styles.header}>
        <Text style={styles.title}>Nokta</Text>
        <Text style={styles.subtitle}>Track A — Dot Capture</Text>
      </View>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Fikrini Buraya Bırak"
          placeholderTextColor="#94A3B8"
          value={idea}
          onChangeText={setIdea}
          multiline
        />

        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Noktayı Olgunlaştır</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Zayıf fikirler burada elenir, gerçek spesifikasyonlar burada doğar.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.dark.background,
  },
  glow: {
    position: 'absolute',
    top: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: Colors.nokta.neonPurple,
    opacity: 0.1,
    filter: 'blur(100px)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.nokta.neonPurple,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 5,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.nokta.glass,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.nokta.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
  },
  input: {
    fontSize: 18,
    color: '#fff',
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.nokta.neonPurple,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.nokta.neonPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    marginTop: 40,
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 40,
  },
});
