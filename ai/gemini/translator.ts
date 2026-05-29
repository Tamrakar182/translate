import type { TranslateImageInput, TranslateImageResult } from '@/ai/types';

export async function translateWithGemini(
  input: TranslateImageInput
): Promise<TranslateImageResult> {
  if (!input.base64) {
    throw new Error('Captured photo does not contain base64 image data.');
  }

  throw new Error('Workshop TODO: live-code the Gemini fetch call here.');
}
