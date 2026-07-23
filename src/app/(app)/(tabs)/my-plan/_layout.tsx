import { Stack } from 'expo-router';

export default function MyPlanLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="planner" />
      <Stack.Screen name="add-course" />
      <Stack.Screen name="assistant" />
      <Stack.Screen name="term/[term]" />
      <Stack.Screen name="recommendation/[code]" />
    </Stack>
  );
}
