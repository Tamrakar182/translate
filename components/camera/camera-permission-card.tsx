import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { colors } from '@/constants/colors';

type CameraPermissionCardProps = {
  onRequestPermission: () => void | Promise<unknown>;
};

export function CameraPermissionCard({
  onRequestPermission,
}: CameraPermissionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconBubble}>
        <AppText style={styles.iconText}>Camera</AppText>
      </View>

      <AppText style={styles.title}>Camera Access Required</AppText>

      <AppText style={styles.subtitle}>
        This app needs camera access to read real-world text and translate it
        using AI.
      </AppText>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={onRequestPermission}
      >
        <AppText style={styles.buttonText}>Allow Camera Access</AppText>
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
  iconBubble: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 36,
    backgroundColor: '#102A43',
  },
  iconText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
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
    fontWeight: '800',
  },
});
