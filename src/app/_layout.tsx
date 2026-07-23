import '../global.css';

import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { PlanProvider } from '@/context/plan-context';
import { colors } from '@/theme/tokens';

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.ink,
    background: colors.canvas,
    card: colors.surface,
    text: colors.ink,
    border: colors.border,
    notification: colors.brand,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={appTheme}>
      <PlanProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.canvas },
            headerShown: false,
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(app)" />
          <Stack.Screen
            name="profile"
            options={{
              animation: 'slide_from_bottom',
              presentation: 'modal',
            }}
          />
        </Stack>
      </PlanProvider>
    </ThemeProvider>
  );
}
