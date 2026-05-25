import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type CameraPermissionCardProps = {
  onRequestPermission: () => void;
};

export function CameraPermissionCard({
  onRequestPermission,
}: CameraPermissionCardProps) {
  return (
    <View style={styles.permissionCard}>
      <View style={styles.permissionIcon}>
        <ThemedText style={styles.permissionIconText}>📷</ThemedText>
      </View>

      <ThemedText style={styles.permissionTitle}>
        Camera Access Required
      </ThemedText>

      <ThemedText style={styles.permissionSubtitle}>
        This app needs camera access to read real-world text and translate it
        using AI.
      </ThemedText>

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.primaryButton}
        onPress={onRequestPermission}
      >
        <ThemedText style={styles.primaryButtonText}>
          Allow Camera Access
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  permissionCard: {
    flex: 1,
    margin: 20,
    borderRadius: 28,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  permissionIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#102A43',
    marginBottom: 20,
  },

  permissionIconText: {
    fontSize: 34,
  },

  permissionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 10,
  },

  permissionSubtitle: {
    fontSize: 15,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },

  primaryButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
  },

  primaryButtonText: {
    color: '#082F49',
    fontWeight: '800',
    fontSize: 15,
  },
});