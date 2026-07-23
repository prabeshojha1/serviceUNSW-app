// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          "paths": [
            {
              "name": "lucide-react-native",
              "message": "Use Ionicons from @expo/vector-icons so icons are consistent across the app."
            },
            {
              "name": "expo-symbols",
              "message": "Use Ionicons from @expo/vector-icons so icons are consistent across platforms."
            },
            {
              "name": "react-native",
              "importNames": ["StyleSheet", "TouchableOpacity", "TouchableHighlight"],
              "message": "Use NativeWind className styles and Pressable-based app UI primitives."
            }
          ]
        }
      ]
    },
  },
]);
