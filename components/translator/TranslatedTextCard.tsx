import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';

type AiReadoutCardProps = {
  translatedText: string;
  isProcessing: boolean;
  isSpeaking: boolean;
  isSpeechPaused: boolean;
  supportsPauseResume: boolean;
  onPauseSpeech: () => void;
  onResumeSpeech: () => void;
};

export function AiReadoutCard({
  translatedText,
  isProcessing,
  isSpeaking,
  isSpeechPaused,
  supportsPauseResume,
  onPauseSpeech,
  onResumeSpeech,
}: AiReadoutCardProps) {
  return (
    <View style={styles.terminalCard}>
      <View style={styles.terminalHeader}>
        <View>
          <ThemedText style={styles.terminalTitle}>AI Readout</ThemedText>
          <ThemedText style={styles.terminalSubtitle}>
            Translated text output
          </ThemedText>
        </View>

        <View
          style={[
            styles.statusDot,
            (isProcessing || isSpeaking) && styles.statusDotActive,
          ]}
        />
      </View>

      <View style={styles.terminalBody}>
        {isProcessing ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#38BDF8" />
            <ThemedText style={styles.processingText}>
              {translatedText}
            </ThemedText>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <ThemedText style={styles.terminalText}>
              {translatedText ||
                'Capture a sign, poster, label, or document to translate it into English.'}
            </ThemedText>
          </ScrollView>
        )}
      </View>

      {isSpeaking && !isProcessing ? (
        supportsPauseResume ? (
          <View style={styles.speechControls}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.speechButton,
                isSpeechPaused && styles.speechButtonDisabled,
              ]}
              onPress={onPauseSpeech}
              disabled={isSpeechPaused}
            >
              <ThemedText style={styles.speechButtonText}>Pause</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.speechButton,
                !isSpeechPaused && styles.speechButtonDisabled,
              ]}
              onPress={onResumeSpeech}
              disabled={!isSpeechPaused}
            >
              <ThemedText style={styles.speechButtonText}>Resume</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.unsupportedCard}>
            <ThemedText style={styles.unsupportedText}>
              Pause and resume are not supported on Android with expo-speech.
            </ThemedText>
          </View>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  terminalCard: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 16,
  },

  terminalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  terminalTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },

  terminalSubtitle: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#475569',
  },

  statusDotActive: {
    backgroundColor: '#38BDF8',
  },

  terminalBody: {
    flex: 1,
    overflow: 'hidden',
  },

  scrollBody: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  terminalText: {
    color: '#E2E8F0',
    fontSize: 17,
    lineHeight: 26,
  },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  processingText: {
    flex: 1,
    color: '#7DD3FC',
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 10,
  },

  speechControls: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },

  speechButton: {
    flex: 1,
    backgroundColor: '#38BDF8',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },

  speechButtonDisabled: {
    backgroundColor: '#334155',
  },

  speechButtonText: {
    color: '#082F49',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  unsupportedCard: {
    marginTop: 14,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#334155',
  },

  unsupportedText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});