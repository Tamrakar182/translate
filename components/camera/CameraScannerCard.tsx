import { CameraView } from 'expo-camera';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';

type CameraScannerCardProps = {
  cameraRef: React.RefObject<CameraView | null>;
  isProcessing: boolean;
  isCaptureDisabled?: boolean;
  captureButtonLabel: string;
  onCapture: () => void;
};

export function CameraScannerCard({
  cameraRef,
  isProcessing,
  isCaptureDisabled = false,
  captureButtonLabel,
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
                (isProcessing || isCaptureDisabled) &&
                  styles.cameraActionButtonDisabled,
              ]}
              onPress={onCapture}
              disabled={isProcessing || isCaptureDisabled}
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
                  {captureButtonLabel}
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