import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, Text, View } from '@/components/ui/native';

import {
  AppScreen,
  Badge,
  Button,
  Card,
  EmptyState,
  IconButton,
  SectionHeader,
} from '@/components/ui/app-ui';
import { useCourseLibrary } from '@/context/course-context';
import { catalogCourses } from '@/data/plan';
import { colors } from '@/theme/tokens';
import { CatalogCourse } from '@/types/plan';

export default function CompareCoursesScreen() {
  const { compareCodes, removeFromCompare } = useCourseLibrary();
  const courses = compareCodes
    .map((code) => catalogCourses.find((course) => course.code === code))
    .filter((course): course is CatalogCourse => !!course);

  return (
    <AppScreen
      action={
        <Button
          icon="add"
          label="Add courses"
          onPress={() => router.push('/courses')}
          size="sm"
          variant="secondary"
        />
      }
      back
      subtitle="Compare up to three courses"
      title="Compare courses">
      {courses.length >= 2 ? (
        <>
          <SectionHeader
            description="Review workload, prerequisites, availability, and degree relevance."
            title={`${courses.length} selected courses`}
          />
          <ScrollView
            horizontal
            contentContainerClassName="gap-3 pb-3"
            showsHorizontalScrollIndicator={false}>
            {courses.map((course) => (
              <Card className="w-72 p-0" key={course.code}>
                <View className="flex-row items-start gap-3 border-b border-border p-4">
                  <View className="min-w-0 flex-1">
                    <Text className="text-sm font-black text-link">{course.code}</Text>
                    <Text className="mt-1 text-lg font-extrabold leading-6 text-ink">
                      {course.title}
                    </Text>
                  </View>
                  <IconButton
                    accessibilityLabel={`Remove ${course.code} from comparison`}
                    icon="close"
                    onPress={() => removeFromCompare(course.code)}
                  />
                </View>
                <ComparisonRow
                  icon="school-outline"
                  label="Credit"
                  value={`${course.uoc} UOC`}
                />
                <ComparisonRow
                  icon="stats-chart-outline"
                  label="Level"
                  value={`Level ${course.code.match(/\d/)?.[0] ?? '—'}`}
                />
                <ComparisonRow
                  icon="git-branch-outline"
                  label="Prerequisites"
                  value={course.prerequisites.join(', ') || 'None'}
                />
                <ComparisonRow
                  icon="calendar-outline"
                  label="Availability"
                  value={course.terms.map(termLabel).join(', ')}
                />
                <ComparisonRow
                  icon="pricetag-outline"
                  label="Interest area"
                  value={course.interest}
                  last
                />
                <View className="p-4">
                  <Button
                    fullWidth
                    label="View course"
                    onPress={() => router.push(`/courses/${course.code}`)}
                    variant="secondary"
                  />
                </View>
              </Card>
            ))}
          </ScrollView>
          <View className="mt-3 flex-row flex-wrap gap-2">
            <Badge label="Maximum 3 courses" tone="neutral" />
            <Badge label="Selection is kept while browsing" tone="info" />
          </View>
        </>
      ) : (
        <EmptyState
          action={<Button label="Choose courses" onPress={() => router.replace('/courses')} />}
          description="Select at least two courses from the catalogue or your saved list."
          icon="git-compare-outline"
          title="Choose another course to compare"
        />
      )}
    </AppScreen>
  );
}

function ComparisonRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View className={`min-h-20 p-4 ${last ? '' : 'border-b border-border'}`}>
      <View className="flex-row items-center gap-2">
        <Ionicons color={colors.muted} name={icon} size={16} />
        <Text className="text-xs font-bold uppercase tracking-wide text-muted">{label}</Text>
      </View>
      <Text className="mt-2 text-sm font-semibold leading-5 text-ink">{value}</Text>
    </View>
  );
}

function termLabel(term: string) {
  const match = term.match(/(\d{4})-t(\d)/);
  return match ? `T${match[2]} ${match[1]}` : term;
}
