import { NO_READABLE_TEXT } from '@/ai/prompts';

type GeminiGenerateContentResponse = {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
  error?: {
    message?: string;
  };
};

export function parseGeminiResponse(data: unknown): string {
  const parsedData = data as GeminiGenerateContentResponse;
  const text = parsedData.candidates?.[0]?.content?.parts?.[0]?.text;

  return text?.trim() || NO_READABLE_TEXT;
}

export function getGeminiErrorMessage(data: unknown): string {
  const parsedData = data as GeminiGenerateContentResponse;

  return parsedData.error?.message || 'Gemini request failed.';
}
