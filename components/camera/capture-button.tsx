import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { colors } from '@/constants/colors';

type CaptureButtonProps = {
  isProcessing: boolean;
  isDisabled: boolean;
  label: string;
  onPress: () => void;
};

export function CaptureButton({
  isProcessing,
  isDisabled,
  label,
  onPress,
}: CaptureButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        (isDisabled || isProcessing) && styles.buttonDisabled,
        pressed && !isDisabled && !isProcessing && styles.buttonPressed,
      ]}
      onPress={onPress}
      disabled={isDisabled || isProcessing}
    >
      {isProcessing ? (
        <View style={styles.processingRow}>
          <ActivityIndicator size="small" color={colors.textMuted} />
          <AppText style={styles.processingText}>Processing...</AppText>
        </View>
      ) : (
        <AppText style={styles.buttonText}>{label}</AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
    minWidth: 210,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 14,
    boxShadow: '0 8px 14px rgba(56, 189, 248, 0.28)',
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
    boxShadow: 'none',
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonText: {
    color: colors.accentText,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  processingText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
});
