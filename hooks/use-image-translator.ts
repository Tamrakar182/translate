import type { CameraView } from 'expo-camera';
import { useCameraPermissions } from 'expo-camera';
import Constants from 'expo-constants';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import { LOCAL_MODEL_UNAVAILABLE_MESSAGE } from '@/ai/litert/config';
import { useLiteRtModel } from '@/ai/litert/use-litert-model';
import { translateImage } from '@/ai/translator';
import type { AiMode } from '@/ai/types';

type UseImageTranslatorParams = {
  onTranslated: (text: string) => void;
};

export function useImageTranslator({
  onTranslated,
}: UseImageTranslatorParams) {
  const [permission, requestPermission] = useCameraPermissions();
  const [aiMode, setAiMode] = useState<AiMode>('gemini');
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const previousModeRef = useRef<AiMode>('gemini');

  const localModelStatus = useLiteRtModel(aiMode === 'litert');
  const isExpoGo = Constants.executionEnvironment === 'storeClient';
  const isCaptureDisabled =
    aiMode === 'litert' && !localModelStatus.isReady;

  const captureButtonLabel = getCaptureButtonLabel(aiMode, localModelStatus);

  useEffect(() => {
    if (
      aiMode === 'litert' &&
      previousModeRef.current !== 'litert' &&
      isExpoGo
    ) {
      Alert.alert('Local Model Unavailable', LOCAL_MODEL_UNAVAILABLE_MESSAGE);
    }

    previousModeRef.current = aiMode;
  }, [aiMode, isExpoGo]);

  const captureAndTranslate = async (): Promise<void> => {
    if (!cameraRef.current || localModelStatus.isLoading || isProcessing) {
      return;
    }

    if (aiMode === 'litert' && !localModelStatus.isReady) {
      Alert.alert(
        'Local Model Unavailable',
        localModelStatus.error || LOCAL_MODEL_UNAVAILABLE_MESSAGE
      );
      return;
    }

    try {
      setIsProcessing(true);
      await Speech.stop();

      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.35,
      });

      if (!photo?.uri) {
        Alert.alert(
          'Capture Failed',
          'Could not capture image data. Please try again.'
        );
        return;
      }

      const result = await translateImage({
        mode: aiMode,
        input: {
          uri: photo.uri,
          base64: photo.base64,
        },
        localModel: localModelStatus.getLoadedModel(),
      });

      onTranslated(result.text);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred.';

      Alert.alert('AI Processing Error', message);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    aiMode,
    cameraRef,
    captureButtonLabel,
    captureAndTranslate,
    isCaptureDisabled,
    isProcessing,
    localModelStatus,
    permission,
    requestPermission,
    setAiMode,
  };
}

function getCaptureButtonLabel(
  aiMode: AiMode,
  localModelStatus: ReturnType<typeof useLiteRtModel>
): string {
  if (aiMode !== 'litert') return 'Capture & Translate';

  if (localModelStatus.isLoading) {
    return `Loading Local Model ${Math.round(
      localModelStatus.downloadProgress * 100
    )}%`;
  }

  if (localModelStatus.error) return 'Local Model Unavailable';

  if (!localModelStatus.isReady) return 'Preparing Local Model';

  return 'Capture & Translate';
}
