import type { CameraView } from 'expo-camera';
import { CameraView as ExpoCameraView } from 'expo-camera';
import type { RefObject } from 'react';
import { StyleSheet, View } from 'react-native';

import { CaptureButton } from '@/components/camera/capture-button';
import { ScanFrame } from '@/components/camera/scan-frame';
import { AppText } from '@/components/ui/app-text';
import { colors } from '@/constants/colors';

type CameraScannerCardProps = {
  cameraRef: RefObject<CameraView | null>;
  isProcessing: boolean;
  isCaptureDisabled: boolean;
  captureButtonLabel: string;
  onCapture: () => void;
};

export function CameraScannerCard({
  cameraRef,
  isProcessing,
  isCaptureDisabled,
  captureButtonLabel,
  onCapture,
}: CameraScannerCardProps) {
  return (
    <>
      <View style={styles.sectionHeader}>
        <AppText style={styles.sectionTitle}>Live Camera Scanner</AppText>
        <AppText style={styles.sectionSubtitle}>
          Place text inside the frame and tap capture.
        </AppText>
      </View>

      <View style={styles.cameraCard}>
        <ExpoCameraView ref={cameraRef} style={styles.camera} facing="back">
          <View style={styles.cameraOverlay}>
            <ScanFrame />
            <CaptureButton
              isProcessing={isProcessing}
              isDisabled={isCaptureDisabled}
              label={captureButtonLabel}
              onPress={onCapture}
            />
          </View>
        </ExpoCameraView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  sectionSubtitle: {
    marginTop: 4,
    color: colors.textSubtle,
    fontSize: 14,
  },
  cameraCard: {
    flex: 1,
    minHeight: 360,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#263449',
    borderRadius: 28,
    backgroundColor: '#020617',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.22)',
  },
});
