import * as Speech from 'expo-speech';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export function useTranslatedSpeech(translatedText: string) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);
  const supportsPauseResume = process.env.EXPO_OS !== 'android';

  const resetSpeechState = useCallback((): void => {
    setIsSpeaking(false);
    setIsSpeechPaused(false);
  }, []);

  const startSpeech = useCallback(async (): Promise<void> => {
    if (!translatedText) return;

    await Speech.stop();
    setIsSpeaking(true);
    setIsSpeechPaused(false);

    Alert.alert(
      'Workshop TODO',
      'Live-code Speech.speak(translatedText) here.'
    );
    resetSpeechState();
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

  useFocusEffect(
    useCallback(() => {
      startSpeech();

      return () => {
        Speech.stop();
        resetSpeechState();
      };
    }, [startSpeech, resetSpeechState])
  );

  return {
    isSpeaking,
    isSpeechPaused,
    pauseSpeech,
    replaySpeech: startSpeech,
    resumeSpeech,
    supportsPauseResume,
  };
}
