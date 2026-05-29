# Camera Translator

An Expo Router app that captures real-world text with the camera, translates it
to English, and reads the result aloud.

## Run

```bash
npm install
npm run start:expo-go
```

Gemini translation works in Expo Go when `EXPO_PUBLIC_GEMINI_KEY` is available
in the environment.

## Local Model Mode

The local LiteRT-LM mode requires a development build:

```bash
npm run start:litert
npm run android:litert
```

The current app path is intentionally small:

- `/` camera capture and engine selection
- `/translated` translated text and speech playback
