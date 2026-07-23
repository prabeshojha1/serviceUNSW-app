import { router } from 'expo-router';
import { View } from 'react-native';

import { CourseListCard } from '@/components/course/course-list-card';
import { AppScreen, Button, EmptyState, SectionHeader } from '@/components/ui/app-ui';
import { useCourseLibrary } from '@/context/course-context';
import { usePlan } from '@/context/plan-context';
import { catalogCourses } from '@/data/plan';

export default function SavedCoursesScreen() {
  const { compareCodes, savedCodes, toggleCompare, toggleSaved } = useCourseLibrary();
  const { isCoursePlanned } = usePlan();
  const savedCourses = catalogCourses.filter((course) => savedCodes.includes(course.code));

  return (
    <AppScreen back subtitle="A shortlist for later" title="Saved courses">
      <SectionHeader
        description={`${savedCourses.length} ${
          savedCourses.length === 1 ? 'course' : 'courses'
        } saved`}
        title="Your shortlist"
      />
      <View className="gap-3">
        {savedCourses.length ? (
          savedCourses.map((course) => (
            <CourseListCard
              compared={compareCodes.includes(course.code)}
              course={course}
              key={course.code}
              onOpen={() => router.push(`/courses/${course.code}`)}
              onToggleCompare={() => toggleCompare(course.code)}
              onToggleSaved={() => toggleSaved(course.code)}
              planned={isCoursePlanned(course.code)}
              saved
            />
          ))
        ) : (
          <EmptyState
            action={
              <Button label="Browse courses" onPress={() => router.replace('/courses')} />
            }
            description="Use the bookmark action on a course to keep it here."
            icon="bookmark-outline"
            title="No saved courses"
          />
        )}
      </View>
    </AppScreen>
  );
}
