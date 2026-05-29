import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { SpeechControls } from '@/components/translation/speech-controls';
import { AppText } from '@/components/ui/app-text';
import { colors } from '@/constants/colors';

type TranslatedReadoutCardProps = {
  translatedText: string;
  isSpeaking: boolean;
  isSpeechPaused: boolean;
  supportsPauseResume: boolean;
  onPauseSpeech: () => void;
  onResumeSpeech: () => void;
};

export function TranslatedReadoutCard({
  translatedText,
  isSpeaking,
  isSpeechPaused,
  supportsPauseResume,
  onPauseSpeech,
  onResumeSpeech,
}: TranslatedReadoutCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <AppText style={styles.title}>AI Readout</AppText>
          <AppText style={styles.subtitle}>Translated text output</AppText>
        </View>

        <View style={[styles.statusDot, isSpeaking && styles.statusDotActive]} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {translatedText ? (
          <AppText selectable style={styles.translatedText}>
            {translatedText}
          </AppText>
        ) : (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.accent} />
            <AppText style={styles.processingText}>
              Preparing translated output...
            </AppText>
          </View>
        )}
      </ScrollView>

      {isSpeaking ? (
        <SpeechControls
          isSpeechPaused={isSpeechPaused}
          supportsPauseResume={supportsPauseResume}
          onPauseSpeech={onPauseSpeech}
          onResumeSpeech={onResumeSpeech}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    backgroundColor: colors.surface,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
    color: colors.textFaint,
    fontSize: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.disabled,
  },
  statusDotActive: {
    backgroundColor: colors.accent,
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  translatedText: {
    color: colors.textMuted,
    fontSize: 17,
    lineHeight: 26,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  processingText: {
    flex: 1,
    marginLeft: 10,
    color: '#7DD3FC',
    fontSize: 14,
    lineHeight: 20,
  },
});
