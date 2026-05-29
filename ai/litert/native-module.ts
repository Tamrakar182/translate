import Constants from 'expo-constants';

import { LOCAL_MODEL_UNAVAILABLE_MESSAGE } from '@/ai/litert/config';
import { LITERT_SYSTEM_PROMPT } from '@/ai/prompts';

type LiteRtModule = typeof import('react-native-litert-lm');

export type LiteRtModelHandle = {
  sendMessageWithImage: (prompt: string, imagePath: string) => Promise<string>;
  isReady?: () => boolean;
  close?: () => void;
};

export function isExpoGo(): boolean {
  return Constants.executionEnvironment === 'storeClient';
}

export function isLiteRtModelHandle(
  model: unknown
): model is LiteRtModelHandle {
  return (
    typeof model === 'object' &&
    model !== null &&
    typeof (model as LiteRtModelHandle).sendMessageWithImage === 'function'
  );
}

export function isLiteRtModelReady(model: unknown): model is LiteRtModelHandle {
  return (
    isLiteRtModelHandle(model) &&
    (typeof model.isReady !== 'function' || model.isReady())
  );
}

export function getLiteRtErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return LOCAL_MODEL_UNAVAILABLE_MESSAGE;
}

export async function importLiteRtModule(): Promise<LiteRtModule> {
  return import('react-native-litert-lm');
}

export function getLiteRtModelOptions() {
  return {
    backend: 'cpu' as const,
    multimodal: true,
    systemPrompt: LITERT_SYSTEM_PROMPT,
  };
}
