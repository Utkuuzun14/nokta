import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Animated, LayoutAnimation } from 'react-native';

type Phase = 'DOT_CAPTURE' | 'SLOP_CHECK' | 'ENGINEERING_PROBE' | 'ARTIFACT';

export default function App() {
  const [phase, setPhase] = useState<Phase>('DOT_CAPTURE');
  const [ideaDot, setIdeaDot] = useState('');
  const [slopMetric, setSlopMetric] = useState(0);
  const [probeIndex, setProbeIndex] = useState(0);
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');

  const probes = [
    { id: 'problem', label: 'PROBLEM DEFINITION', hint: 'What specific friction does this solve? Do not say "makes life easier".' },
    { id: 'user', label: 'TARGET PERSONA', hint: 'Who explicitly pays for or uses this today? Be precise.' },
    { id: 'scope', label: 'MVP BOUNDARIES', hint: 'List 3 things you will explicitly NOT build in v1.' },
    { id: 'constraint', label: 'HARD CONSTRAINTS', hint: 'Compliance, API limits, or budget ceilings?' }
  ];

  const handleDotSubmit = () => {
    if (ideaDot.trim().length < 10) return;
    setPhase('SLOP_CHECK');
    
    // Simulate AI Slop Check
    setTimeout(() => setSlopMetric(25), 600);
    setTimeout(() => setSlopMetric(60), 1200);
    setTimeout(() => {
      setSlopMetric(100);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setPhase('ENGINEERING_PROBE');
    }, 1800);
  };

  const handleProbeSubmit = () => {
    if (!currentAnswer.trim()) return;
    
    const currentProbe = probes[probeIndex];
    setAnswers(prev => ({ ...prev, [currentProbe.id]: currentAnswer }));
    setCurrentAnswer('');

    if (probeIndex < probes.length - 1) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setProbeIndex(probeIndex + 1);
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setPhase('ARTIFACT');
    }
  };

  const restartProcess = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPhase('DOT_CAPTURE');
    setIdeaDot('');
    setProbeIndex(0);
    setAnswers({});
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <Text style={styles.logo}>NOKTA_</Text>
        <Text style={styles.statusLabel}>
          STATUS // {phase.replace('_', ' ')}
        </Text>
      </View>

      {/* PHASE 1: DOT CAPTURE */}
      {phase === 'DOT_CAPTURE' && (
        <View style={styles.contentCore}>
          <Text style={styles.moduleTitle}>INGEST SEED DOT</Text>
          <Text style={styles.moduleSub}>Enter raw idea. We will strip the slop and extract the engineering skeleton.</Text>
          <TextInput
            style={styles.bigInput}
            multiline
            placeholder="e.g. 'A mobile app that detects academic plagiarism using local LLMs...'"
            placeholderTextColor="#444"
            value={ideaDot}
            onChangeText={setIdeaDot}
          />
          <TouchableOpacity 
            style={[styles.btnTrigger, ideaDot.length < 10 && styles.btnDisabled]} 
            onPress={handleDotSubmit}
            disabled={ideaDot.length < 10}
          >
            <Text style={styles.btnText}>INITIATE SLOP-CHECK</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* PHASE 2: SLOP CHECK (Transition) */}
      {phase === 'SLOP_CHECK' && (
        <View style={styles.contentCore}>
          <Text style={styles.moduleTitle}>ANALYZING DENSITY...</Text>
          <Text style={styles.moduleSub}>Running vector similarity against known buzzwords.</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${slopMetric}%` }]} />
          </View>
          <Text style={styles.metricText}>FILTERING SLOP: {slopMetric}%</Text>
        </View>
      )}

      {/* PHASE 3: ENGINEERING PROBE */}
      {phase === 'ENGINEERING_PROBE' && (
        <View style={styles.contentCore}>
          <Text style={styles.moduleTitle}>ENGINEERING GUIDANCE</Text>
          <Text style={styles.moduleSub}>Step {probeIndex + 1} of {probes.length}</Text>
          
          <View style={styles.probeCard}>
            <Text style={styles.probePhase}>PROBE_{probeIndex + 1}</Text>
            <Text style={styles.probeLabel}>{probes[probeIndex].label}</Text>
            <Text style={styles.probeHint}>{probes[probeIndex].hint}</Text>
          </View>

          <TextInput
            style={styles.probeInput}
            multiline
            placeholder="Awaiting technical input..."
            placeholderTextColor="#444"
            value={currentAnswer}
            onChangeText={setCurrentAnswer}
          />
          
          <TouchableOpacity style={styles.btnTrigger} onPress={handleProbeSubmit}>
            <Text style={styles.btnText}>COMMIT NODE</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* PHASE 4: ARTIFACT GENERATION */}
      {phase === 'ARTIFACT' && (
        <ScrollView style={styles.artifactCore}>
          <View style={styles.artifactHeader}>
            <Text style={styles.artifactTitle}>GOLDEN SPEC ARTIFACT</Text>
            <Text style={styles.artifactMeta}>SLOP RATIO: 0.02% | QUALITY: ENTERPRISE-GRADE</Text>
          </View>

          <View style={styles.artifactSection}>
            <Text style={styles.artifactSecLabel}>[01] THE SEED</Text>
            <Text style={styles.artifactValue}>{ideaDot}</Text>
          </View>

          {probes.map((probe, i) => (
            <View key={probe.id} style={styles.artifactSection}>
              <Text style={styles.artifactSecLabel}>[0{i + 2}] {probe.label}</Text>
              <Text style={styles.artifactValue}>{answers[probe.id]}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.btnOutline} onPress={restartProcess}>
            <Text style={styles.btnOutlineText}>COMMENCE NEW CYCLE</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090D' },
  header: { paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderColor: '#1F1F2A', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  logo: { fontSize: 24, fontWeight: '900', color: '#00E5FF', letterSpacing: -1 },
  statusLabel: { fontSize: 10, color: '#FF5722', fontWeight: 'bold', letterSpacing: 1.5 },
  
  contentCore: { flex: 1, padding: 25, justifyContent: 'center' },
  moduleTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 8, letterSpacing: -0.5 },
  moduleSub: { fontSize: 14, color: '#888899', marginBottom: 30, lineHeight: 22 },
  
  bigInput: { backgroundColor: '#111116', borderWidth: 1, borderColor: '#2A2A35', color: '#FFF', fontSize: 18, borderRadius: 8, padding: 20, minHeight: 180, textAlignVertical: 'top', marginBottom: 20 },
  
  btnTrigger: { backgroundColor: '#00E5FF', paddingVertical: 18, borderRadius: 8, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#222233', opacity: 0.5 },
  btnText: { color: '#09090D', fontSize: 14, fontWeight: '900', letterSpacing: 1 },

  btnOutline: { borderWidth: 1, borderColor: '#00E5FF', paddingVertical: 18, borderRadius: 8, alignItems: 'center', marginTop: 10, marginBottom: 40 },
  btnOutlineText: { color: '#00E5FF', fontSize: 14, fontWeight: '900', letterSpacing: 1 },

  progressTrack: { height: 4, backgroundColor: '#1A1A24', borderRadius: 2, overflow: 'hidden', marginBottom: 15 },
  progressFill: { height: '100%', backgroundColor: '#00E5FF' },
  metricText: { color: '#00E5FF', fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },

  probeCard: { backgroundColor: '#14141A', borderLeftWidth: 4, borderLeftColor: '#FF5722', padding: 20, marginBottom: 20 },
  probePhase: { color: '#FF5722', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 5 },
  probeLabel: { color: '#FFF', fontSize: 18, fontWeight: '800', marginBottom: 10 },
  probeHint: { color: '#A0A0B0', fontSize: 13, fontStyle: 'italic' },
  probeInput: { backgroundColor: '#111116', borderWidth: 1, borderColor: '#2A2A35', color: '#FFF', fontSize: 16, borderRadius: 8, padding: 20, minHeight: 140, textAlignVertical: 'top', marginBottom: 20 },

  artifactCore: { flex: 1, padding: 20 },
  artifactHeader: { borderBottomWidth: 2, borderBottomColor: '#00E5FF', paddingBottom: 15, marginBottom: 20, marginTop: 20 },
  artifactTitle: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  artifactMeta: { color: '#00E5FF', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginTop: 5 },
  artifactSection: { backgroundColor: '#111116', padding: 20, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#22222C' },
  artifactSecLabel: { color: '#FF5722', fontSize: 11, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  artifactValue: { color: '#E0E0E5', fontSize: 15, lineHeight: 24, fontWeight: '500' }
});
