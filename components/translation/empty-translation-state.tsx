import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { colors } from '@/constants/colors';

type EmptyTranslationStateProps = {
  onBackToCamera: () => void;
};

export function EmptyTranslationState({
  onBackToCamera,
}: EmptyTranslationStateProps) {
  return (
    <View style={styles.card}>
      <AppText style={styles.title}>No Translation Found</AppText>

      <AppText style={styles.subtitle}>
        Go back to the camera and capture text first.
      </AppText>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={onBackToCamera}
      >
        <AppText style={styles.buttonText}>Back to Camera</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 28,
    backgroundColor: colors.surface,
    padding: 24,
  },
  title: {
    marginBottom: 8,
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 24,
    color: colors.textSubtle,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    borderRadius: 999,
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonText: {
    color: colors.accentText,
    fontSize: 15,
    fontWeight: '900',
  },
});
