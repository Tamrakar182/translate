import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CameraPermissionCard } from '../components/camera/CameraPermissionCard';
import { CameraScannerCard } from '../components/camera/CameraScannerCard';
import {
  DEFAULT_GEMINI_MODEL,
  GeminiModel,
  listAvailableGeminiModels,
  sendRequestToGemini,
} from '@/utils/api';

export default function HomeScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [availableModels, setAvailableModels] = useState<GeminiModel[]>([]);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_GEMINI_MODEL);

  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {

   

    const loadModels = async (): Promise<void> => {
      try {
        setIsLoadingModels(true);

         const models = await listAvailableGeminiModels();

        setAvailableModels(models);

        const hasDefaultModel = models.some(
          (model) => model.name === `models/${DEFAULT_GEMINI_MODEL}`
        );

        if (!hasDefaultModel && models.length > 0) {
          setSelectedModel(models[0].name.replace(/^models\//, ''));
        }

      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Could not load Gemini models.';

        Alert.alert('Model Loading Error', message);
      } finally {
        setIsLoadingModels(false);
      }
    };

    loadModels();
  }, []);

  const captureAndTranslate = async (): Promise<void> => {
    if (!cameraRef.current || isProcessing) return;

    try {
      setIsProcessing(true);

      await Speech.stop();

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.35,
        base64: true,
      });

      if (!photo?.base64) {
        Alert.alert(
          'Capture Failed',
          'Could not capture image data. Please try again.'
        );
        return;
      }

      const parsedData = await sendRequestToGemini(photo, selectedModel);

      const resultText: string | undefined =
        parsedData?.candidates?.[0]?.content?.parts?.[0]?.text;

      const cleanOutput = resultText?.trim() || 'No readable text found.';

      router.push({
        pathname: '/translated',
        params: {
          text: cleanOutput,
          model: selectedModel,
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred.';

      Alert.alert('AI Processing Error', message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#38BDF8" />
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CameraPermissionCard onRequestPermission={requestPermission} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.contentContainer}>
        <CameraScannerCard
          cameraRef={cameraRef}
          isProcessing={isProcessing}
          isLoadingModels={isLoadingModels}
          models={availableModels}
          selectedModel={selectedModel}
          onSelectedModelChange={setSelectedModel}
          onCapture={captureAndTranslate}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#07111F',
  },

  contentContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 20,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});