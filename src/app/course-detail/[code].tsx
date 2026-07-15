import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppShell, PrimaryButton, SecondaryButton, palette, sharedStyles } from '@/components/plan-ui';
import { getCatalogCourse } from '@/context/plan-context';

export default function CourseDetailPlaceholder() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const course = getCatalogCourse(code);

  return (
    <AppShell title={course?.code ?? code} eyebrow="Course catalogue placeholder" showBack>
      <View style={sharedStyles.card}>
        <Text style={styles.title}>{course?.title ?? 'Course details'}</Text>
        <Text style={styles.meta}>{course?.uoc ?? 6} UOC · {course?.interest ?? 'Course catalogue'}</Text>
        <Text style={styles.description}>{course?.description ?? 'Person 5 will provide the complete course description, outline, availability, and convenor details.'}</Text>
        {!!course?.prerequisites.length && (
          <Text style={styles.prereq}>Prerequisites: {course.prerequisites.join(', ')}</Text>
        )}
        <View style={styles.actions}>
          <PrimaryButton label="Add to MyPlan" onPress={() => router.push({ pathname: '/add-course', params: { code: course?.code ?? code } })} />
          <SecondaryButton label="Back to courses" onPress={() => router.push('/course-search')} />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  title: { color: palette.ink, fontSize: 24, lineHeight: 30, fontWeight: '800' },
  meta: { color: palette.blue, fontSize: 14, fontWeight: '700', marginTop: 8 },
  description: { color: palette.muted, fontSize: 16, lineHeight: 24, marginTop: 20 },
  prereq: { color: palette.ink, fontSize: 14, lineHeight: 21, fontWeight: '600', marginTop: 16 },
  actions: { gap: 10, marginTop: 24 },
});
