import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CameraPermissionCard } from '@/components/camera/camera-permission-card';
import { CameraScannerCard } from '@/components/camera/camera-scanner-card';
import { CenteredLoader } from '@/components/ui/centered-loader';
import { colors } from '@/constants/colors';
import { useImageTranslator } from '@/hooks/use-image-translator';

export default function HomeScreen() {
  const translator = useImageTranslator({
    onTranslated: (text) => {
      Alert.alert(
        'Workshop TODO',
        `Navigate to /translated with this text:\n\n${text}`
      );
    },
  });

  if (!translator.permission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CenteredLoader />
      </SafeAreaView>
    );
  }

  if (!translator.permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CameraPermissionCard
          onRequestPermission={translator.requestPermission}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <CameraScannerCard
          cameraRef={translator.cameraRef}
          isProcessing={translator.isProcessing}
          isCaptureDisabled={translator.isCaptureDisabled}
          captureButtonLabel={translator.captureButtonLabel}
          onCapture={translator.captureAndTranslate}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 20,
  },
});
