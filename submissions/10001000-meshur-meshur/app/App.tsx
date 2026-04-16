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
            <Text style={styles.artifactMeta}>SLOP RATIO: 0.00% | STATUS: READY FOR AI AGENTS</Text>
          </View>

          <View style={styles.artifactSection}>
            <Text style={styles.artifactSecLabel}>[1] EXECUTIVE SUMMARY</Text>
            <Text style={styles.artifactValue}>
              A highly targeted product aimed at {answers.user || 'specified users'}, addressing the critical friction of {answers.problem || 'their problem'}. 
              The core thesis builds upon: "{ideaDot}".
            </Text>
          </View>

          <View style={styles.artifactSection}>
            <Text style={styles.artifactSecLabel}>[2] HOW TO CREATE (EXECUTION PLAN)</Text>
            <Text style={styles.artifactValue}>
              PHASE 1: Stick strictly to the MVP boundaries. Do NOT build: {answers.scope || 'unnecessary features'}.{'\n\n'}
              PHASE 2: Adopt infrastructure that respects the hard constraints: {answers.constraint || 'system limits'}. Ensure compliance from day zero.
            </Text>
          </View>

          <View style={styles.artifactSection}>
            <Text style={styles.artifactSecLabel}>[3] COPY-PASTE AI PROMPTS</Text>
            <Text style={styles.artifactPrompt}>
              // PROMPT FOR CURSOR / CLAUDE CODE:{'\n'}
              "Initialize an Expo React Native application targeting {answers.user || 'users'} experiencing {answers.problem || 'issues'}. The app must STRICTLY exclude {answers.scope || 'these features'}. Keep the architecture within these constraints: {answers.constraint || 'none'}. Output the boilerplate app.json and package.json first."
            </Text>
            <View style={{height: 15}} />
            <Text style={styles.artifactPrompt}>
              // PROMPT TO ENHANCE FEATURE SET:{'\n'}
              "Acting as a Senior Product Manager, review this MVP spec. Suggest exactly two high-leverage gamification mechanics that require zero backend changes, keeping {answers.constraint || 'limits'} in mind."
            </Text>
          </View>

          <View style={styles.artifactSection}>
            <Text style={styles.artifactSecLabel}>[4] MINDMAP (ARCHITECTURE TREE)</Text>
            
            <View style={styles.mindmapModule}>
              {/* Root */}
              <View style={{alignItems: 'center'}}>
                <View style={styles.mindmapNodeRoot}>
                  <Text style={styles.mindmapTextRoot}>CORE: {ideaDot.substring(0,25)}...</Text>
                </View>
                <View style={styles.mindmapLineVert} />
              </View>

              {/* L1 Branches */}
              <View style={styles.mindmapLevel}>
                <View style={[styles.mindmapLineHoriz, {width: '60%'}]} />
                <View style={styles.mindmapRow}>
                  <View style={styles.mindmapBranch}>
                    <View style={styles.mindmapLineVertSmall} />
                    <View style={styles.mindmapNode}>
                      <Text style={styles.mindmapTextNode}>PERSONA</Text>
                      <Text style={styles.mindmapDescNode}>{answers.user?.substring(0, 15)}...</Text>
                    </View>
                  </View>

                  <View style={styles.mindmapBranch}>
                    <View style={styles.mindmapLineVertSmall} />
                    <View style={styles.mindmapNodeCenter}>
                      <Text style={styles.mindmapTextNode}>PROBLEM</Text>
                      <Text style={styles.mindmapDescNode}>{answers.problem?.substring(0, 15)}...</Text>
                    </View>
                    <View style={styles.mindmapLineVertSmall} />
                    <View style={styles.mindmapNodeAction}>
                      <Text style={styles.mindmapTextAction}>MVP SCOPE</Text>
                    </View>
                  </View>

                  <View style={styles.mindmapBranch}>
                    <View style={styles.mindmapLineVertSmall} />
                    <View style={styles.mindmapNode}>
                      <Text style={styles.mindmapTextNode}>LIMITS</Text>
                      <Text style={styles.mindmapDescNode}>{answers.constraint?.substring(0, 15)}...</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.btnOutline} onPress={restartProcess}>
            <Text style={styles.btnOutlineText}>COMMENCE NEW CYCLE</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050508' },
  header: { paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderColor: '#1F1F2A', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', backgroundColor: 'rgba(9,9,13,0.9)' },
  logo: { fontSize: 26, fontWeight: '900', color: '#00E5FF', letterSpacing: -1, textShadowColor: 'rgba(0, 229, 255, 0.4)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  statusLabel: { fontSize: 10, color: '#FF5722', fontWeight: 'bold', letterSpacing: 1.5 },
  
  contentCore: { flex: 1, padding: 25, justifyContent: 'center' },
  moduleTitle: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', marginBottom: 8, letterSpacing: -1 },
  moduleSub: { fontSize: 15, color: '#888899', marginBottom: 30, lineHeight: 22 },
  
  bigInput: { backgroundColor: '#0D0D14', borderWidth: 1, borderColor: '#2A2A35', color: '#FFF', fontSize: 18, borderRadius: 12, padding: 20, minHeight: 180, textAlignVertical: 'top', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5 },
  
  btnTrigger: { backgroundColor: '#00E5FF', paddingVertical: 18, borderRadius: 12, alignItems: 'center', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 15, elevation: 5 },
  btnDisabled: { backgroundColor: '#222233', opacity: 0.5, shadowOpacity: 0 },
  btnText: { color: '#050508', fontSize: 15, fontWeight: '900', letterSpacing: 1.5 },

  btnOutline: { borderWidth: 1, borderColor: '#00E5FF', backgroundColor: 'rgba(0,229,255,0.05)', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, marginBottom: 40 },
  btnOutlineText: { color: '#00E5FF', fontSize: 15, fontWeight: '900', letterSpacing: 1.5 },

  progressTrack: { height: 4, backgroundColor: '#1A1A24', borderRadius: 2, overflow: 'hidden', marginBottom: 15 },
  progressFill: { height: '100%', backgroundColor: '#00E5FF' },
  metricText: { color: '#00E5FF', fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },

  probeCard: { backgroundColor: '#0D0D14', borderLeftWidth: 4, borderLeftColor: '#FF5722', padding: 25, marginBottom: 20, borderRadius: 8 },
  probePhase: { color: '#FF5722', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
  probeLabel: { color: '#FFF', fontSize: 20, fontWeight: '900', marginBottom: 10 },
  probeHint: { color: '#A0A0B0', fontSize: 14, fontStyle: 'italic', lineHeight: 20 },
  probeInput: { backgroundColor: '#0D0D14', borderWidth: 1, borderColor: '#2A2A35', color: '#FFF', fontSize: 16, borderRadius: 12, padding: 20, minHeight: 140, textAlignVertical: 'top', marginBottom: 20 },

  artifactCore: { flex: 1, padding: 20 },
  artifactHeader: { borderBottomWidth: 2, borderBottomColor: '#00E5FF', paddingBottom: 15, marginBottom: 20, marginTop: 20 },
  artifactTitle: { fontSize: 26, fontWeight: '900', color: '#FFF', textShadowColor: 'rgba(0, 229, 255, 0.3)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  artifactMeta: { color: '#00E5FF', fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5, marginTop: 5 },
  artifactSection: { backgroundColor: '#0D0D14', padding: 20, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#22222C', shadowColor: '#000', shadowOffset: {width:0, height: 5}, shadowOpacity: 0.3, shadowRadius: 5 },
  artifactSecLabel: { color: '#FF5722', fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 10 },
  artifactValue: { color: '#E0E0E5', fontSize: 15, lineHeight: 24, fontWeight: '500' },
  artifactPrompt: { color: '#00E5FF', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 13, lineHeight: 20, backgroundColor: '#050508', padding: 15, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,229,255,0.2)' },

  /* MINDMAP STYLES */
  mindmapModule: { marginTop: 15, paddingVertical: 10 },
  mindmapNodeRoot: { backgroundColor: '#FF5722', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, zIndex: 2 },
  mindmapTextRoot: { color: '#FFF', fontWeight: '900', fontSize: 13, letterSpacing: 1 },
  mindmapLineVert: { width: 2, height: 20, backgroundColor: '#333' },
  mindmapLineVertSmall: { width: 2, height: 15, backgroundColor: '#333', alignSelf: 'center' },
  mindmapLevel: { alignItems: 'center' },
  mindmapLineHoriz: { height: 2, backgroundColor: '#333' },
  mindmapRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 },
  mindmapBranch: { alignItems: 'center', flex: 1 },
  mindmapNode: { backgroundColor: '#1A1A24', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#333', width: '90%', alignItems: 'center' },
  mindmapNodeCenter: { backgroundColor: '#1A1A24', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#00E5FF', width: '90%', alignItems: 'center' },
  mindmapNodeAction: { backgroundColor: 'transparent', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#FF5722', borderStyle: 'dashed', width: '90%', alignItems: 'center' },
  mindmapTextNode: { color: '#FFF', fontWeight: '800', fontSize: 10, letterSpacing: 0.5, marginBottom: 4 },
  mindmapTextAction: { color: '#FF5722', fontWeight: '800', fontSize: 10, letterSpacing: 0.5 },
  mindmapDescNode: { color: '#888', fontSize: 9, textAlign: 'center' },
});
