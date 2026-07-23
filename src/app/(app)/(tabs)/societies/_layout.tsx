import { Stack } from 'expo-router';

import { SocietyProvider } from '@/context/society-context';

export default function SocietiesLayout() {
  return (
    <SocietyProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="[id]" />
        <Stack.Screen name="subscribed" />
        <Stack.Screen name="events/index" />
        <Stack.Screen name="events/[id]" />
      </Stack>
    </SocietyProvider>
  );
}
