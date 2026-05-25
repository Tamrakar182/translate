import { CameraView } from 'expo-camera';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { GeminiModel } from '@/utils/api';

type CameraScannerCardProps = {
  cameraRef: React.RefObject<CameraView | null>;
  isProcessing: boolean;
  isLoadingModels: boolean;
  models: GeminiModel[];
  selectedModel: string;
  onSelectedModelChange: (model: string) => void;
  onCapture: () => void;
};

const getModelId = (modelName: string): string => {
  return modelName.replace(/^models\//, '');
};

const getModelLabel = (model: GeminiModel): string => {
  return model.displayName || getModelId(model.name);
};

export function CameraScannerCard({
  cameraRef,
  isProcessing,
  isLoadingModels,
  models,
  selectedModel,
  onSelectedModelChange,
  onCapture,
}: CameraScannerCardProps) {
  return (
    <>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Live Camera Scanner</ThemedText>
        <ThemedText style={styles.sectionSubtitle}>
          Place text inside the frame and tap capture.
        </ThemedText>
      </View>

      <View style={styles.modelSelectorCard}>
        <View style={styles.modelSelectorHeader}>
          <ThemedText style={styles.modelSelectorTitle}>Gemini Model</ThemedText>

          {isLoadingModels ? (
            <ActivityIndicator size="small" color="#38BDF8" />
          ) : null}
        </View>

        {models.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.modelPillRow}
          >
            {models.map((model) => {
              const modelId = getModelId(model.name);
              const isSelected = selectedModel === modelId;

              return (
                <TouchableOpacity
                  key={model.name}
                  activeOpacity={0.85}
                  style={[
                    styles.modelPill,
                    isSelected && styles.modelPillSelected,
                  ]}
                  onPress={() => onSelectedModelChange(modelId)}
                  disabled={isProcessing}
                >
                  <ThemedText
                    style={[
                      styles.modelPillText,
                      isSelected && styles.modelPillTextSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {getModelLabel(model)}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <ThemedText style={styles.modelFallbackText}>
            {isLoadingModels
              ? 'Loading available models...'
              : `Using ${selectedModel}`}
          </ThemedText>
        )}
      </View>

      <View style={styles.cameraCard}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back">
          <View style={styles.cameraOverlay}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
            </View>

            <View style={styles.cameraHint}>
              <ThemedText style={styles.cameraHintText}>
                Align text inside this area
              </ThemedText>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.cameraActionButton,
                isProcessing && styles.cameraActionButtonDisabled,
              ]}
              onPress={onCapture}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <View style={styles.cameraProcessingRow}>
                  <ActivityIndicator size="small" color="#E2E8F0" />
                  <ThemedText style={styles.cameraProcessingText}>
                    Processing...
                  </ThemedText>
                </View>
              ) : (
                <ThemedText style={styles.cameraActionButtonText}>
                  Capture & Translate
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#94A3B8',
  },

  modelSelectorCard: {
    borderRadius: 20,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
    marginBottom: 14,
  },

  modelSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  modelSelectorTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },

  modelPillRow: {
    gap: 8,
    paddingRight: 4,
  },

  modelPill: {
    maxWidth: 220,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#334155',
  },

  modelPillSelected: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },

  modelPillText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '800',
  },

  modelPillTextSelected: {
    color: '#082F49',
  },

  modelFallbackText: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
  },

  cameraCard: {
    flex: 1,
    minHeight: 360,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#263449',
  },

  camera: {
    flex: 1,
  },

  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scanFrame: {
    width: '78%',
    height: '46%',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  corner: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderColor: '#38BDF8',
  },

  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },

  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },

  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },

  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },

  cameraHint: {
    position: 'absolute',
    top: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
  },

  cameraHintText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },

  cameraActionButton: {
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
    minWidth: 210,
    minHeight: 48,
    backgroundColor: '#38BDF8',
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38BDF8',
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 6,
  },

  cameraActionButtonDisabled: {
    backgroundColor: '#475569',
    shadowOpacity: 0,
    elevation: 0,
  },

  cameraActionButtonText: {
    color: '#082F49',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },

  cameraProcessingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  cameraProcessingText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});