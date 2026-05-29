import { LOCAL_MODEL_UNAVAILABLE_MESSAGE } from '@/ai/litert/config';
import { isLiteRtModelReady } from '@/ai/litert/native-module';
import { IMAGE_TRANSLATION_PROMPT, NO_READABLE_TEXT } from '@/ai/prompts';
import type { TranslateImageInput, TranslateImageResult } from '@/ai/types';

type TranslateWithLiteRtModelParams = {
  input: TranslateImageInput;
  localModel?: unknown;
};

export async function translateWithLiteRtModel({
  input,
  localModel,
}: TranslateWithLiteRtModelParams): Promise<TranslateImageResult> {
  if (!input.uri) {
    throw new Error('Captured photo URI is missing.');
  }

  if (!isLiteRtModelReady(localModel)) {
    throw new Error(LOCAL_MODEL_UNAVAILABLE_MESSAGE);
  }

  const text = await localModel.sendMessageWithImage(
    IMAGE_TRANSLATION_PROMPT,
    toNativeFilePath(input.uri)
  );

  return {
    text: text.trim() || NO_READABLE_TEXT,
    engine: 'litert',
  };
}

function toNativeFilePath(uri: string): string {
  if (!uri.startsWith('file://')) return uri;

  return decodeURIComponent(uri.replace('file://', ''));
}
