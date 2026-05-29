import { translateWithGemini } from './gemini-translator';
import { translateWithLiteRtModel } from './litert-translator';
import type {
    AiMode,
    TranslateImageInput,
    TranslateImageResult,
} from './types';

export async function translateImage(params: {
  mode: AiMode;
  input: TranslateImageInput;
  localModel?: unknown;
}): Promise<TranslateImageResult> {
  if (params.mode === 'litert') {
    return translateWithLiteRtModel({
      input: params.input,
      localModel: params.localModel,
    });
  }

  return translateWithGemini(params.input);
}
