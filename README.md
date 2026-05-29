# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

This default workflow keeps Expo Go compatibility for the Gemini and Mock modes.

## AI Modes

- `gemini` is the default mode and works in Expo Go.
- `mock` is an offline demo mode that works in Expo Go.
- `litert` uses a local LiteRT-LM model and requires a development build.

To use the local model path, install the native packages and build a dev client:

```bash
npm install react-native-litert-lm react-native-nitro-modules
npx expo install expo-dev-client
npx expo prebuild
npx expo run:android
```

The Expo config includes the LiteRT-LM config plugin for the development-build workflow:

```json
{
   "expo": {
      "plugins": ["react-native-litert-lm"],
      "android": {
         "minSdkVersion": 26
      }
   }
}
```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
