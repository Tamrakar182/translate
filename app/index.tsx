import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LOCAL_MODEL_UNAVAILABLE_MESSAGE } from '@/ai/litert/config';
import { CameraPermissionCard } from '@/components/camera/camera-permission-card';
import { CameraScannerCard } from '@/components/camera/camera-scanner-card';
import { TranslationEngineCard } from '@/components/translation/translation-engine-card';
import { CenteredLoader } from '@/components/ui/centered-loader';
import { colors } from '@/constants/colors';
import { useImageTranslator } from '@/hooks/use-image-translator';

export default function HomeScreen() {
  const router = useRouter();
  const translator = useImageTranslator({
    onTranslated: (text) => {
      router.push({
        pathname: '/translated',
        params: { text },
      });
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
        <TranslationEngineCard
          mode={translator.aiMode}
          localModelStatus={translator.localModelStatus}
          localModelUnavailableMessage={LOCAL_MODEL_UNAVAILABLE_MESSAGE}
          onModeChange={translator.setAiMode}
        />

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
