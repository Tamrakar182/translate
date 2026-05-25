import * as Speech from 'expo-speech';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { AiReadoutCard } from '../components/translator/TranslatedTextCard';

export default function TranslatedScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    text?: string | string[];
  }>();

  const translatedText = Array.isArray(params.text)
    ? params.text[0]
    : params.text || '';

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);

  const supportsPauseResume = Platform.OS !== 'android';

  const resetSpeechState = useCallback((): void => {
    setIsSpeaking(false);
    setIsSpeechPaused(false);
  }, []);

  const startSpeech = useCallback(async (): Promise<void> => {
    if (!translatedText) return;

    await Speech.stop();

    setIsSpeaking(true);
    setIsSpeechPaused(false);

    Speech.speak(translatedText, {
      language: 'en',
      pitch: 1.0,
      rate: 0.95,

      onStart: () => {
        setIsSpeaking(true);
        setIsSpeechPaused(false);
      },

      onDone: resetSpeechState,

      onStopped: resetSpeechState,

      onError: resetSpeechState,
    });
  }, [translatedText, resetSpeechState]);

  const pauseSpeech = async (): Promise<void> => {
    if (!isSpeaking || isSpeechPaused) return;

    if (!supportsPauseResume) {
      Alert.alert(
        'Pause Not Supported',
        'expo-speech does not support pause/resume on Android.'
      );
      return;
    }

    try {
      setIsSpeechPaused(true);

      await Speech.pause();
    } catch {
      setIsSpeechPaused(false);

      Alert.alert('Speech Error', 'Could not pause speech.');
    }
  };

  const resumeSpeech = async (): Promise<void> => {
    if (!isSpeaking || !isSpeechPaused) return;

    if (!supportsPauseResume) {
      Alert.alert(
        'Resume Not Supported',
        'expo-speech does not support pause/resume on Android.'
      );
      return;
    }

    try {
      await Speech.resume();

      setIsSpeechPaused(false);
      setIsSpeaking(true);
    } catch {
      Alert.alert('Speech Error', 'Could not resume speech.');
    }
  };

  const replaySpeech = async (): Promise<void> => {
    await startSpeech();
  };

  useFocusEffect(
    useCallback(() => {
      startSpeech();

      return () => {
        Speech.stop();
        resetSpeechState();
      };
    }, [startSpeech, resetSpeechState])
  );

  if (!translatedText) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyCard}>
          <ThemedText style={styles.emptyTitle}>No Translation Found</ThemedText>

          <ThemedText style={styles.emptySubtitle}>
            Go back to the camera and capture text first.
          </ThemedText>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.primaryButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.primaryButtonText}>
              Back to Camera
            </ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.contentContainer}>
        <AiReadoutCard
          translatedText={translatedText}
          isProcessing={false}
          isSpeaking={isSpeaking}
          isSpeechPaused={isSpeechPaused}
          supportsPauseResume={supportsPauseResume}
          onPauseSpeech={pauseSpeech}
          onResumeSpeech={resumeSpeech}
        />

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.replayButton}
          onPress={replaySpeech}
        >
          <ThemedText style={styles.replayButtonText}>Replay Speech</ThemedText>
        </TouchableOpacity>
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

  emptyCard: {
    flex: 1,
    margin: 20,
    borderRadius: 28,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },

  emptySubtitle: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },

  primaryButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
  },

  primaryButtonText: {
    color: '#082F49',
    fontWeight: '900',
    fontSize: 15,
  },

  replayButton: {
    marginTop: 14,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },

  replayButtonText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});