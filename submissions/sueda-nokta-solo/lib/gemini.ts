import type { SlopResult } from '@/constants/slop-types';

const API_KEY = "AQ.Ab8RN6KzglmleO0bgk1cE3LN5Uvzk1v5Z6SPxAeSxzpWCIIzBw";
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;
const REQUEST_TIMEOUT_MS = 5000;

function normalizeSeverity(severity: string): 'Critical' | 'High' | 'Medium' | 'Low' {
  const candidate = severity.toLowerCase();
  if (candidate === 'critical') return 'Critical';
  if (candidate === 'high') return 'High';
  if (candidate === 'medium') return 'Medium';
  return 'Low';
}

function parseModelJson(rawText: string): SlopResult {
  const trimmed = rawText.trim();
  const match = trimmed.match(/```json\s*([\s\S]*?)```/i);
  const payload = match?.[1]?.trim() ?? trimmed;
  const parsed = JSON.parse(payload) as Partial<SlopResult>;

  if (
    typeof parsed.slop_score !== 'number' ||
    typeof parsed.is_slop !== 'boolean' ||
    typeof parsed.analysis !== 'string' ||
    !Array.isArray(parsed.flaws) ||
    !Array.isArray(parsed.engineering_questions)
  ) {
    throw new Error('Gemini response is not in expected schema.');
  }

  return {
    slop_score: Math.max(0, Math.min(100, Math.round(parsed.slop_score))),
    is_slop: parsed.is_slop,
    analysis: parsed.analysis,
    flaws: parsed.flaws.map((item) => ({
      type: typeof item.type === 'string' ? item.type : 'Belirsiz Kusur',
      description: typeof item.description === 'string' ? item.description : 'Aciklama saglanmadi.',
      severity: normalizeSeverity(typeof item.severity === 'string' ? item.severity : 'Low'),
    })),
    engineering_questions: parsed.engineering_questions.map((item) => ({
      question: typeof item.question === 'string' ? item.question : 'Soru uretilmedi.',
      why_critical:
        typeof item.why_critical === 'string'
          ? item.why_critical
          : 'Bu alan model tarafindan doldurulamadi.',
      severity: normalizeSeverity(typeof item.severity === 'string' ? item.severity : 'Low'),
    })),
  };
}

export async function analyzeIdeaWithGemini(ideaText: string): Promise<SlopResult> {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key is missing.');
    }

    const prompt = `
Sen "Nokta Slop Detector" icin teknik degerlendirme motorusun.
Asagidaki girisim fikrini acimasizca analiz et.
SADECE gecerli JSON dondur, markdown veya baska metin yazma.

Beklenen schema:
{
  "slop_score": number (0-100),
  "is_slop": boolean,
  "analysis": string,
  "flaws": [
    { "type": string, "description": string, "severity": "Critical" | "High" | "Medium" | "Low" }
  ],
  "engineering_questions": [
    { "question": string, "why_critical": string, "severity": "Critical" | "High" | "Medium" | "Low" }
  ]
}

Kurallar:
- En az 3 flaw ver.
- En az 2 engineering question ver.
- Dil Turkce olsun.

Fikir:
${ideaText}
`.trim();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
          },
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini request failed (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('Gemini response was empty.');
    }

    return parseModelJson(rawText);
  } catch (error) {
    console.error('Gemini API request error:', error);
    throw error;
  }
}
