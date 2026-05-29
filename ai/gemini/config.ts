export const GEMINI_MODEL = 'gemini-2.5-flash';
export const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export function getGeminiApiKey(): string {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_KEY;

  if (!apiKey) {
    throw new Error('Missing EXPO_PUBLIC_GEMINI_KEY in your environment.');
  }

  return apiKey;
}

export function getGenerateContentUrl(model = GEMINI_MODEL): string {
  return `${GEMINI_BASE_URL}/models/${model}:generateContent`;
}
