import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type QAItem = {
  question: string;
  answer: string;
};

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "openai/gpt-4o-mini";

const fallbackQuestions = (idea: string): string[] => {
  const shortIdea = idea.trim().slice(0, 80);
  return [
    `Asil problem nedir ve neden simdi cozulmeli? (${shortIdea})`,
    "Birincil hedef kullanici kim, hangi durumda bu urunu aciyor?",
    "MVP kapsami nedir: ilk surumde mutlaka olacak 3 ozellik ne?",
    "Teknik ve operasyonel kisitlar neler (zaman, butce, veri, cihaz)?",
    "Basari metrigi ne olacak: 2 haftada neyi olcersek dogru yolda oldugumuzu anlariz?",
  ];
};

const fallbackSpec = (idea: string, qaItems: QAItem[]): string => {
  const filled = qaItems.filter((item) => item.answer.trim().length > 0);
  const answerMap = new Map(filled.map((item) => [item.question, item.answer.trim()]));

  return [
    "# One-Page Product Spec",
    "",
    "## Product Idea",
    idea.trim(),
    "",
    "## Problem",
    answerMap.get(qaItems[0]?.question ?? "") || "Netlestirilecek.",
    "",
    "## Target User",
    answerMap.get(qaItems[1]?.question ?? "") || "Netlestirilecek.",
    "",
    "## MVP Scope",
    answerMap.get(qaItems[2]?.question ?? "") || "Netlestirilecek.",
    "",
    "## Constraints",
    answerMap.get(qaItems[3]?.question ?? "") || "Netlestirilecek.",
    "",
    "## Success Metric",
    answerMap.get(qaItems[4]?.question ?? "") || "Netlestirilecek.",
    "",
    "## First Sprint Plan",
    "- Day 1-2: requirements freeze + wireframe",
    "- Day 3-4: core flow implementation",
    "- Day 5: QA + demo prep",
  ].join("\n");
};

const extractListItems = (text: string): string[] =>
  text
    .split("\n")
    .map((line) => line.replace(/^\s*[-*\d.)]+\s*/, "").trim())
    .filter((line) => line.length > 0);

async function callOpenRouter(prompt: string): Promise<string | null> {
  const apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
  if (!apiKey) {
    return null;
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://github.com/mrkarahann/nokta",
      "X-Title": "Nokta Dot Capture Submission",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a strict product coach. Keep output concise, practical, and engineering focused.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? null;
}

export default function App() {
  const [ideaText, setIdeaText] = useState("");
  const [qaItems, setQaItems] = useState<QAItem[]>([]);
  const [specText, setSpecText] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingSpec, setLoadingSpec] = useState(false);

  const hasAnswers = useMemo(
    () => qaItems.some((item) => item.answer.trim().length > 0),
    [qaItems],
  );

  const handleGenerateQuestions = async () => {
    if (!ideaText.trim()) {
      Alert.alert("Bos fikir", "Devam etmek icin once bir fikir girisi yap.");
      return;
    }

    setLoadingQuestions(true);
    setSpecText("");

    try {
      const prompt = [
        "Asagidaki ham fikir icin 5 tane engineering discovery sorusu uret.",
        "Her soru ayri satirda olsun, numaralandirma kullanabilirsin.",
        "Kapsam: problem, user, scope, constraint, success metric.",
        "",
        `Fikir: ${ideaText.trim()}`,
      ].join("\n");

      const aiResponse = await callOpenRouter(prompt);
      const parsedQuestions = aiResponse ? extractListItems(aiResponse).slice(0, 5) : [];
      const finalQuestions = parsedQuestions.length >= 3 ? parsedQuestions : fallbackQuestions(ideaText);

      setQaItems(finalQuestions.map((question) => ({ question, answer: "" })));
    } catch {
      setQaItems(fallbackQuestions(ideaText).map((question) => ({ question, answer: "" })));
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleGenerateSpec = async () => {
    if (!ideaText.trim()) {
      Alert.alert("Bos fikir", "Spec uretmek icin once fikir girisi yap.");
      return;
    }

    if (!hasAnswers) {
      Alert.alert("Cevap gerekli", "Spec uretmek icin en az bir soruyu cevapla.");
      return;
    }

    setLoadingSpec(true);
    try {
      const prompt = [
        "Asagidaki girdilerle tek sayfa urun spec'i yaz.",
        "Basliklar: Product Idea, Problem, Target User, MVP Scope, Constraints, Success Metric, First Sprint Plan.",
        "Yalnizca markdown don.",
        "",
        `Fikir: ${ideaText.trim()}`,
        "",
        "Soru-Cevap:",
        ...qaItems.map(
          (item, index) =>
            `${index + 1}. Soru: ${item.question}\n   Cevap: ${item.answer || "Bos"}`,
        ),
      ].join("\n");

      const aiResponse = await callOpenRouter(prompt);
      setSpecText(aiResponse?.trim() || fallbackSpec(ideaText, qaItems));
    } catch {
      setSpecText(fallbackSpec(ideaText, qaItems));
    } finally {
      setLoadingSpec(false);
    }
  };

  const resetAll = () => {
    setIdeaText("");
    setQaItems([]);
    setSpecText("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>NOKTA - Dot Capture & Enrich</Text>
        <Text style={styles.subtitle}>
          Ham fikri al, 5 soruyla netlestir, tek sayfa spec uret.
        </Text>

        <Text style={styles.sectionLabel}>1) Ham Fikir Girisi</Text>
        <TextInput
          value={ideaText}
          onChangeText={setIdeaText}
          placeholder="Ornek: Restoranlar icin talebe gore dinamik menu optimizasyonu"
          multiline
          style={styles.ideaInput}
        />

        <Pressable
          style={styles.primaryButton}
          onPress={handleGenerateQuestions}
          disabled={loadingQuestions}
        >
          {loadingQuestions ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>2) Sorulari Uret</Text>
          )}
        </Pressable>

        {qaItems.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>3) Sorulari Cevapla</Text>
            {qaItems.map((item, index) => (
              <View key={`${item.question}-${index}`} style={styles.qaBlock}>
                <Text style={styles.questionText}>
                  {index + 1}. {item.question}
                </Text>
                <TextInput
                  value={item.answer}
                  onChangeText={(answer) => {
                    setQaItems((prev) =>
                      prev.map((entry, i) => (i === index ? { ...entry, answer } : entry)),
                    );
                  }}
                  placeholder="Cevabini buraya yaz"
                  multiline
                  style={styles.answerInput}
                />
              </View>
            ))}
          </View>
        )}

        {qaItems.length > 0 && (
          <Pressable
            style={styles.primaryButton}
            onPress={handleGenerateSpec}
            disabled={loadingSpec}
          >
            {loadingSpec ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>4) One-Page Spec Uret</Text>
            )}
          </Pressable>
        )}

        {specText.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Spec Ciktisi</Text>
            <Text selectable style={styles.specText}>
              {specText}
            </Text>
          </View>
        )}

        <Pressable style={styles.secondaryButton} onPress={resetAll}>
          <Text style={styles.secondaryText}>Sifirla</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f6fb",
  },
  container: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#334155",
    marginBottom: 6,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  ideaInput: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    minHeight: 100,
    padding: 12,
    textAlignVertical: "top",
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbeafe",
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  qaBlock: {
    gap: 6,
  },
  questionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  answerInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    minHeight: 70,
    padding: 10,
    textAlignVertical: "top",
  },
  specText: {
    color: "#0f172a",
    lineHeight: 21,
  },
  secondaryButton: {
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 10,
  },
  secondaryText: {
    color: "#475569",
    fontWeight: "600",
  },
});
