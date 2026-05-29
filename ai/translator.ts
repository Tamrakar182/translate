import { translateWithGemini } from '@/ai/gemini/translator';
import type {
  TranslateImageInput,
  TranslateImageResult,
} from '@/ai/types';

export async function translateImage(
  input: TranslateImageInput
): Promise<TranslateImageResult> {
  return translateWithGemini(input);
}
