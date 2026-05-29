import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import type { AiMode } from '@/ai/types';
import { AppText } from '@/components/ui/app-text';
import { colors } from '@/constants/colors';

export type LocalModelStatus = {
  isReady: boolean;
  isLoading: boolean;
  downloadProgress: number;
  error: string | null;
};

type TranslationEngineCardProps = {
  mode: AiMode;
  localModelStatus: LocalModelStatus;
  localModelUnavailableMessage: string;
  onModeChange: (mode: AiMode) => void;
};

type EngineOptionProps = {
  mode: AiMode;
  selectedMode: AiMode;
  title: string;
  description: string;
  badge?: string;
  isBusy?: boolean;
  isDimmed?: boolean;
  onPress: (mode: AiMode) => void;
};

export function TranslationEngineCard({
  mode,
  localModelStatus,
  localModelUnavailableMessage,
  onModeChange,
}: TranslationEngineCardProps) {
  const localStatusText = getLocalStatusText(
    localModelStatus,
    localModelUnavailableMessage
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppText style={styles.title}>Translation Engine</AppText>
        <AppText style={styles.subtitle}>Gemini is the default mode.</AppText>
      </View>

      <View style={styles.optionList}>
        <EngineOption
          mode="gemini"
          selectedMode={mode}
          title="Gemini"
          description="Cloud translation with the Gemini API."
          badge="Recommended"
          onPress={onModeChange}
        />

        <EngineOption
          mode="litert"
          selectedMode={mode}
          title="Local"
          description="On-device LiteRT-LM for development builds."
          isBusy={mode === 'litert' && localModelStatus.isLoading}
          isDimmed={
            mode === 'litert' &&
            (localModelStatus.isLoading || !localModelStatus.isReady)
          }
          onPress={onModeChange}
        />
      </View>

      {mode === 'litert' ? (
        <View style={styles.statusCard}>
          <AppText style={styles.statusText}>{localStatusText}</AppText>
        </View>
      ) : null}
    </View>
  );
}

function EngineOption({
  mode,
  selectedMode,
  title,
  description,
  badge,
  isBusy = false,
  isDimmed = false,
  onPress,
}: EngineOptionProps) {
  const isSelected = selectedMode === mode;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.option,
        isSelected && styles.optionSelected,
        isDimmed && styles.optionDimmed,
        pressed && styles.optionPressed,
      ]}
      onPress={() => onPress(mode)}
    >
      <View style={styles.optionTopRow}>
        <AppText
          style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}
        >
          {title}
        </AppText>

        {isBusy ? <ActivityIndicator size="small" color={colors.accent} /> : null}

        {badge ? (
          <View style={styles.badge}>
            <AppText style={styles.badgeText}>{badge}</AppText>
          </View>
        ) : null}
      </View>

      <AppText
        style={[
          styles.optionDescription,
          isSelected && styles.optionDescriptionSelected,
        ]}
      >
        {description}
      </AppText>
    </Pressable>
  );
}

function getLocalStatusText(
  status: LocalModelStatus,
  unavailableMessage: string
): string {
  if (status.error) return status.error;

  if (status.isLoading) {
    return `Downloading model ${Math.round(status.downloadProgress * 100)}%`;
  }

  if (status.isReady) return 'Local model is ready.';

  return unavailableMessage;
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    backgroundColor: colors.surface,
    padding: 14,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 4,
    color: colors.textSubtle,
    fontSize: 13,
    lineHeight: 18,
  },
  optionList: {
    gap: 10,
  },
  option: {
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  optionDimmed: {
    opacity: 0.9,
  },
  optionPressed: {
    opacity: 0.82,
  },
  optionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  optionTitle: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '900',
  },
  optionTitleSelected: {
    color: colors.accentText,
  },
  optionDescription: {
    marginTop: 6,
    color: colors.textSubtle,
    fontSize: 12,
    lineHeight: 17,
  },
  optionDescriptionSelected: {
    color: colors.accentDeep,
  },
  badge: {
    borderRadius: 999,
    backgroundColor: 'rgba(15, 118, 110, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  statusCard: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.22)',
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statusText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
});
