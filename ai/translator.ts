import { translateWithGemini } from '@/ai/gemini/translator';
import { translateWithLiteRtModel } from '@/ai/litert/translator';
import type {
    AiMode,
    TranslateImageInput,
    TranslateImageResult,
} from '@/ai/types';

export type TranslateImageParams = {
  mode: AiMode;
  input: TranslateImageInput;
  localModel?: unknown;
};

export async function translateImage({
  mode,
  input,
  localModel,
}: TranslateImageParams): Promise<TranslateImageResult> {
  if (mode === 'litert') {
    return translateWithLiteRtModel({ input, localModel });
  }

  return translateWithGemini(input);
}
