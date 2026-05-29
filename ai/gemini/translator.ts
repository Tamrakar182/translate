import { getGeminiApiKey, getGenerateContentUrl } from '@/ai/gemini/config';
import { createGeminiImageTranslationPayload } from '@/ai/gemini/payload';
import {
    getGeminiErrorMessage,
    parseGeminiResponse,
} from '@/ai/gemini/response';
import type { TranslateImageInput, TranslateImageResult } from '@/ai/types';

export async function translateWithGemini(
  input: TranslateImageInput
): Promise<TranslateImageResult> {
  if (!input.base64) {
    throw new Error('Captured photo does not contain base64 image data.');
  }

  const response = await fetch(getGenerateContentUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': getGeminiApiKey(),
    },
    body: JSON.stringify(createGeminiImageTranslationPayload(input.base64)),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getGeminiErrorMessage(data));
  }

  return {
    text: parseGeminiResponse(data),
    engine: 'gemini',
  };
}
