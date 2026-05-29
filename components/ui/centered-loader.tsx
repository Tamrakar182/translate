import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';

export function CenteredLoader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
