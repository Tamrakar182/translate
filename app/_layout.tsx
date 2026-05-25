import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#07111F',
          },
          headerTintColor: '#F8FAFC',
          headerTitleStyle: {
            fontWeight: '800',
          },
          contentStyle: {
            backgroundColor: '#07111F',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Camera Translator',
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="translated"
          options={{
            title: 'Translated Text',
          }}
        />
      </Stack>

      <StatusBar style="light" />
    </ThemeProvider>
  );
}