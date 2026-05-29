import type { CameraView } from 'expo-camera';
import * as Speech from 'expo-speech';
import { useRef, useState } from 'react';
import { Alert } from 'react-native';

import { translateImage } from '@/ai/translator';
import type { TranslateImageInput } from '@/ai/types';

type UseImageTranslatorParams = {
  onTranslated: (text: string) => void;
};

export function useImageTranslator({
  onTranslated,
}: UseImageTranslatorParams) {
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const permission = { granted: false };

  const requestPermission = (): void => {
    Alert.alert(
      'Workshop TODO',
      'Live-code useCameraPermissions() here.'
    );
  };

  const captureAndTranslate = async (): Promise<void> => {
    if (!cameraRef.current || isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);
      await Speech.stop();

      const photo = await capturePhoto(cameraRef.current);

      if (!photo?.uri) {
        Alert.alert(
          'Capture Failed',
          'Could not capture image data. Please try again.'
        );
        return;
      }

      const result = await translateImage(photo);

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
    cameraRef,
    captureButtonLabel: 'Capture & Translate',
    captureAndTranslate,
    isCaptureDisabled: false,
    isProcessing,
    permission,
    requestPermission,
  };
}

async function capturePhoto(
  _camera: CameraView
): Promise<TranslateImageInput> {
  throw new Error('Workshop TODO: live-code takePictureAsync() here.');
}
