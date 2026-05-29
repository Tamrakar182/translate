import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { colors } from '@/constants/colors';

type SpeechControlsProps = {
  isSpeechPaused: boolean;
  supportsPauseResume: boolean;
  onPauseSpeech: () => void;
  onResumeSpeech: () => void;
};

export function SpeechControls({
  isSpeechPaused,
  supportsPauseResume,
  onPauseSpeech,
  onResumeSpeech,
}: SpeechControlsProps) {
  if (!supportsPauseResume) {
    return (
      <View style={styles.unsupportedCard}>
        <AppText style={styles.unsupportedText}>
          Pause and resume are not supported on Android with expo-speech.
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.controls}>
      <SpeechButton
        label="Pause"
        isDisabled={isSpeechPaused}
        onPress={onPauseSpeech}
      />
      <SpeechButton
        label="Resume"
        isDisabled={!isSpeechPaused}
        onPress={onResumeSpeech}
      />
    </View>
  );
}

function SpeechButton({
  label,
  isDisabled,
  onPress,
}: {
  label: string;
  isDisabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonPressed,
      ]}
      disabled={isDisabled}
      onPress={onPress}
    >
      <AppText style={styles.buttonText}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: colors.accent,
    paddingVertical: 12,
  },
  buttonDisabled: {
    backgroundColor: colors.borderMuted,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonText: {
    color: colors.accentText,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  unsupportedCard: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  unsupportedText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});
