import Constants from 'expo-constants';
import { useEffect, useRef, useState } from 'react';

import type { TranslateImageInput, TranslateImageResult } from './types';

const LOCAL_MODEL_URL =
  'https://litert.dev/gemma-3n-E2B-it-int4.litertlm';
const LOCAL_MODEL_PROMPT =
  'Extract any visible text from this image. Translate the extracted text clearly into English. Return ONLY the final English translated text. If there is no readable text, return: No readable text found.';
const LOCAL_MODEL_UNAVAILABLE_MESSAGE =
  'Local model mode requires a development build.';

type LiteRtModelHandle = {
  sendMessageWithImage: (prompt: string, imagePath: string) => Promise<string>;
  close?: () => void;
};

type LiteRtModule = typeof import('react-native-litert-lm');

const isExpoGo = (): boolean => {
  return Constants.executionEnvironment === 'storeClient';
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'Local model mode requires a development build.';
};

const isLiteRtModelHandle = (
  model: unknown
): model is LiteRtModelHandle => {
  return (
    typeof model === 'object' &&
    model !== null &&
    typeof (model as LiteRtModelHandle).sendMessageWithImage === 'function'
  );
};

const getLiteRtModule = async (): Promise<LiteRtModule> => {
  return import('react-native-litert-lm');
};

export async function createLiteRtModel(
  onProgress?: (progress: number) => void
): Promise<LiteRtModelHandle> {
  if (isExpoGo()) {
    throw new Error(LOCAL_MODEL_UNAVAILABLE_MESSAGE);
  }

  const { createLLM } = await getLiteRtModule();
  const llm = createLLM();

  await llm.loadModel(
    LOCAL_MODEL_URL,
    {
      backend: 'cpu',
      multimodal: true,
      systemPrompt:
        'You extract visible text from images and translate it into English.',
    },
    onProgress
  );

  return llm;
}

export async function translateWithLiteRtModel({
  input,
  localModel,
}: {
  input: TranslateImageInput;
  localModel?: unknown;
}): Promise<TranslateImageResult> {
  if (!input.uri) {
    throw new Error('Captured photo URI is missing.');
  }

  if (!isLiteRtModelHandle(localModel)) {
    throw new Error(LOCAL_MODEL_UNAVAILABLE_MESSAGE);
  }

  const text = await localModel.sendMessageWithImage(
    LOCAL_MODEL_PROMPT,
    input.uri
  );

  return {
    text: text.trim() || 'No readable text found.',
    engine: 'litert',
  };
}

export function useLiteRtModel(isEnabled: boolean): {
  localModel: unknown;
  isReady: boolean;
  isLoading: boolean;
  downloadProgress: number;
  error: string | null;
} {
  const [localModel, setLocalModel] = useState<unknown>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const modelRef = useRef<LiteRtModelHandle | null>(null);
  const activeRequestId = useRef(0);

  useEffect(() => {
    activeRequestId.current += 1;
    const requestId = activeRequestId.current;
    let cancelled = false;

    const resetModel = (): void => {
      modelRef.current?.close?.();
      modelRef.current = null;
      setLocalModel(null);
      setIsReady(false);
      setIsLoading(false);
      setDownloadProgress(0);
    };

    if (!isEnabled) {
      resetModel();
      setError(null);
      return () => {
        resetModel();
      };
    }

    if (isExpoGo()) {
      resetModel();
      setError(LOCAL_MODEL_UNAVAILABLE_MESSAGE);
      return () => {
        resetModel();
      };
    }

    const loadModel = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setDownloadProgress(0);
        setError(null);

        const model = await createLiteRtModel((progress) => {
          if (!cancelled && requestId === activeRequestId.current) {
            setDownloadProgress(progress);
          }
        });

        if (cancelled || requestId !== activeRequestId.current) {
          model.close?.();
          return;
        }

        modelRef.current = model;
        setLocalModel(model);
        setIsReady(true);
      } catch (loadError) {
        if (cancelled || requestId !== activeRequestId.current) return;

        setError(getErrorMessage(loadError));
        setLocalModel(null);
        setIsReady(false);
      } finally {
        if (!cancelled && requestId === activeRequestId.current) {
          setIsLoading(false);
        }
      }
    };

    loadModel();

    return () => {
      cancelled = true;
      modelRef.current?.close?.();
      modelRef.current = null;
    };
  }, [isEnabled]);

  return {
    localModel,
    isReady,
    isLoading,
    downloadProgress,
    error,
  };
}
