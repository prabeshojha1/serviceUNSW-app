import { Stack } from 'expo-router';

import { CourseProvider } from '@/context/course-context';

export default function CoursesLayout() {
  return (
    <CourseProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="[code]" />
        <Stack.Screen name="saved" />
        <Stack.Screen name="compare" />
      </Stack>
    </CourseProvider>
  );
}
