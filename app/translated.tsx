import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyTranslationState } from '@/components/translation/empty-translation-state';
import { TranslatedReadoutCard } from '@/components/translation/translated-readout-card';
import { AppText } from '@/components/ui/app-text';
import { colors } from '@/constants/colors';
import { useTranslatedSpeech } from '@/hooks/use-translated-speech';

export default function TranslatedScreen() {
  const router = useRouter();
  const translatedText = useTranslatedTextParam();
  const speech = useTranslatedSpeech(translatedText);

  if (!translatedText) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <EmptyTranslationState onBackToCamera={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.content}>
        <TranslatedReadoutCard
          translatedText={translatedText}
          isSpeaking={speech.isSpeaking}
          isSpeechPaused={speech.isSpeechPaused}
          supportsPauseResume={speech.supportsPauseResume}
          onPauseSpeech={speech.pauseSpeech}
          onResumeSpeech={speech.resumeSpeech}
        />

        <Pressable
          style={({ pressed }) => [
            styles.replayButton,
            pressed && styles.replayButtonPressed,
          ]}
          onPress={speech.replaySpeech}
        >
          <AppText style={styles.replayButtonText}>Replay Speech</AppText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function useTranslatedTextParam(): string {
  const params = useLocalSearchParams<{
    text?: string | string[];
  }>();

  return Array.isArray(params.text) ? params.text[0] : params.text || '';
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 20,
  },
  replayButton: {
    alignItems: 'center',
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: 999,
    backgroundColor: colors.surfaceRaised,
    paddingVertical: 14,
  },
  replayButtonPressed: {
    opacity: 0.82,
  },
  replayButtonText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
