import { CameraView, useCameraPermissions } from 'expo-camera';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useLiteRtModel } from '@/src/ai/litert-translator';
import { translateImage } from '@/src/ai/translate-image';
import type { AiMode } from '@/src/ai/types';
import { CameraPermissionCard } from '../components/camera/CameraPermissionCard';
import { CameraScannerCard } from '../components/camera/CameraScannerCard';

const LOCAL_MODEL_UNAVAILABLE_MESSAGE =
  'Local model mode requires a development build.';

export default function HomeScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [aiMode, setAiMode] = useState<AiMode>('gemini');
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const previousModeRef = useRef<AiMode>('gemini');

  const localModelState = useLiteRtModel(aiMode === 'litert');
  const isExpoGo = Constants.executionEnvironment === 'storeClient';

  const isLocalModeReady = aiMode !== 'litert' || localModelState.isReady;
  const isCaptureDisabled = aiMode === 'litert' && !localModelState.isReady;

  const captureButtonLabel = (() => {
    if (aiMode === 'litert') {
      if (localModelState.isLoading) {
        return `Loading Local Model ${Math.round(
          localModelState.downloadProgress * 100
        )}%`;
      }

      if (localModelState.error) {
        return 'Local Model Unavailable';
      }

      if (!isLocalModeReady) {
        return 'Preparing Local Model';
      }
    }

    return 'Capture & Translate';
  })();

  useEffect(() => {
    if (aiMode === 'litert' && previousModeRef.current !== 'litert' && isExpoGo) {
      Alert.alert('Local Model Unavailable', LOCAL_MODEL_UNAVAILABLE_MESSAGE);
    }

    previousModeRef.current = aiMode;
  }, [aiMode, isExpoGo]);

  const handleModeChange = (mode: AiMode): void => {
    setAiMode(mode);
  };

  const captureAndTranslate = async (): Promise<void> => {
    if (!cameraRef.current || localModelState.isLoading || isProcessing) return;

    if (aiMode === 'litert' && !localModelState.isReady) {
      Alert.alert(
        'Local Model Unavailable',
        localModelState.error || LOCAL_MODEL_UNAVAILABLE_MESSAGE
      );
      return;
    }

    try {
      setIsProcessing(true);

      await Speech.stop();

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.35,
        base64: true,
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
        localModel: localModelState.localModel,
      });

      router.push({
        pathname: '/translated',
        params: {
          text: result.text,
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
        <View style={styles.engineCard}>
          <View style={styles.engineHeaderRow}>
            <ThemedText style={styles.engineTitle}>Translation Engine</ThemedText>
            <ThemedText style={styles.engineSubtitle}>
              Gemini is the default mode.
            </ThemedText>
          </View>

          <View style={styles.enginePillRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.enginePill,
                aiMode === 'gemini' && styles.enginePillSelected,
              ]}
              onPress={() => handleModeChange('gemini')}
            >
              <View style={styles.enginePillTopRow}>
                <ThemedText
                  style={[
                    styles.enginePillLabel,
                    aiMode === 'gemini' && styles.enginePillLabelSelected,
                  ]}
                >
                  Gemini
                </ThemedText>
                <View style={styles.recommendedBadge}>
                  <ThemedText style={styles.recommendedBadgeText}>
                    Recommended
                  </ThemedText>
                </View>
              </View>
              <ThemedText
                style={[
                  styles.enginePillDescription,
                  aiMode === 'gemini' && styles.enginePillDescriptionSelected,
                ]}
              >
                Cloud translation with the Gemini API.
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.enginePill,
                aiMode === 'litert' && styles.enginePillSelected,
                aiMode === 'litert' &&
                  (localModelState.isLoading || !localModelState.isReady) &&
                  styles.enginePillDisabled,
              ]}
              onPress={() => handleModeChange('litert')}
            >
              <View style={styles.enginePillTopRow}>
                <ThemedText
                  style={[
                    styles.enginePillLabel,
                    aiMode === 'litert' && styles.enginePillLabelSelected,
                  ]}
                >
                  Local
                </ThemedText>
                {aiMode === 'litert' && localModelState.isLoading ? (
                  <ActivityIndicator size="small" color="#38BDF8" />
                ) : null}
              </View>
              <ThemedText
                style={[
                  styles.enginePillDescription,
                  aiMode === 'litert' && styles.enginePillDescriptionSelected,
                ]}
              >
                On-device LiteRT-LM for development builds.
              </ThemedText>
            </TouchableOpacity>
          </View>

          {aiMode === 'litert' ? (
            <View style={styles.engineStatusCard}>
              <ThemedText style={styles.engineStatusText}>
                {localModelState.error
                  ? localModelState.error
                  : localModelState.isLoading
                    ? `Downloading model ${Math.round(
                        localModelState.downloadProgress * 100
                      )}%`
                    : localModelState.isReady
                      ? 'Local model is ready.'
                      : LOCAL_MODEL_UNAVAILABLE_MESSAGE}
              </ThemedText>
            </View>
          ) : null}
        </View>

        <CameraScannerCard
          cameraRef={cameraRef}
          isProcessing={isProcessing}
          isCaptureDisabled={isCaptureDisabled}
          captureButtonLabel={captureButtonLabel}
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

  engineCard: {
    borderRadius: 22,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
    marginBottom: 14,
  },

  engineHeaderRow: {
    marginBottom: 10,
  },

  engineTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '900',
  },

  engineSubtitle: {
    marginTop: 4,
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
  },

  enginePillRow: {
    gap: 10,
  },

  enginePill: {
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#334155',
  },

  enginePillSelected: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },

  enginePillDisabled: {
    opacity: 0.9,
  },

  enginePillTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  enginePillLabel: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '900',
  },

  enginePillLabelSelected: {
    color: '#082F49',
  },

  enginePillDescription: {
    marginTop: 6,
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 17,
  },

  enginePillDescriptionSelected: {
    color: '#0C4A6E',
  },

  recommendedBadge: {
    backgroundColor: 'rgba(15, 118, 110, 0.14)',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },

  recommendedBadgeText: {
    color: '#0F766E',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  engineStatusCard: {
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.22)',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  engineStatusText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
  },
});
