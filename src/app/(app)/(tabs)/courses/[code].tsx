import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/ui/native';

import {
  AppScreen,
  Badge,
  Button,
  Card,
  EmptyState,
  InlineNotice,
  SectionHeader,
} from '@/components/ui/app-ui';
import { useCourseLibrary } from '@/context/course-context';
import { getCatalogCourse, getTermLabel, usePlan } from '@/context/plan-context';
import { outlineTopics } from '@/data/course-outline-data';
import { colors } from '@/theme/tokens';

export default function CourseDetailScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const course = getCatalogCourse(code);
  const { compareCodes, savedCodes, toggleCompare, toggleSaved } = useCourseLibrary();
  const { isCoursePlanned } = usePlan();

  if (!course) {
    return (
      <AppScreen back title="Course unavailable">
        <EmptyState
          action={<Button label="Back to courses" onPress={() => router.replace('/courses')} />}
          description="The requested course could not be found in this catalogue."
          icon="alert-circle-outline"
          title="Course not found"
        />
      </AppScreen>
    );
  }

  const saved = savedCodes.includes(course.code);
  const compared = compareCodes.includes(course.code);
  const planned = isCoursePlanned(course.code);

  return (
    <AppScreen back subtitle="Course catalogue" title={course.code}>
      <View className="gap-8">
        <View className="gap-5 xl:flex-row xl:items-start">
          <View className="min-w-0 flex-[1.5]">
            <View className="flex-row flex-wrap gap-2">
              <Badge label={`${course.uoc} UOC`} tone="info" />
              <Badge label={course.interest} tone="neutral" />
              {planned ? <Badge label="In MyPlan" tone="success" /> : null}
            </View>
            <Text className="mt-4 text-3xl font-black tracking-tight text-ink md:text-4xl">
              {course.title}
            </Text>
            <Text className="mt-4 max-w-3xl text-base leading-7 text-muted">
              {course.description}
            </Text>

            <View className="mt-6 flex-row flex-wrap gap-3">
              <Button
                disabled={planned}
                icon={planned ? 'checkmark' : 'add'}
                label={planned ? 'Already in MyPlan' : 'Add to MyPlan'}
                onPress={() =>
                  router.push({
                    pathname: '/my-plan/add-course',
                    params: { course: course.code },
                  })
                }
              />
              <Button
                icon={saved ? 'bookmark' : 'bookmark-outline'}
                label={saved ? 'Saved' : 'Save course'}
                onPress={() => toggleSaved(course.code)}
                variant="secondary"
              />
              <Button
                icon={compared ? 'checkmark' : 'git-compare-outline'}
                label={compared ? 'Comparing' : 'Compare'}
                onPress={() => toggleCompare(course.code)}
                variant="secondary"
              />
            </View>
          </View>

          <Card className="min-w-0 flex-1">
            <Text className="text-sm font-extrabold uppercase tracking-wide text-muted">
              Course facts
            </Text>
            <Fact
              icon="calendar-outline"
              label="Offered"
              value={course.terms.map(getTermLabel).join(', ')}
            />
            <Fact
              icon="git-branch-outline"
              label="Prerequisites"
              value={course.prerequisites.join(', ') || 'No formal prerequisites'}
            />
            <Fact icon="school-outline" label="Credit" value={`${course.uoc} units of credit`} />
          </Card>
        </View>

        <InlineNotice
          action={
            <Button
              icon="sparkles-outline"
              label="Ask about this course"
              onPress={() =>
                router.push({
                  pathname: '/my-plan',
                  params: { assistant: '1', course: course.code },
                })
              }
              size="sm"
              variant="ai"
            />
          }
          description="Check prerequisites, workload, and how this course fits your current plan."
          icon="sparkles-outline"
          title="Get planning guidance"
          tone="ai"
        />

        <View className="gap-6 xl:flex-row xl:items-start">
          <View className="min-w-0 flex-[1.4]">
            <SectionHeader title="Overview" />
            <Card>
              <Text className="text-base leading-7 text-muted">
                This course develops practical and conceptual capability in {course.interest.toLowerCase()}.
                Learning activities combine lectures, guided practice, and independent assessment.
                Confirm the latest delivery details and rules in the official UNSW Handbook before
                enrolling.
              </Text>
            </Card>
          </View>
          <View className="min-w-0 flex-1">
            <SectionHeader title="Indicative outline" />
            <Card className="p-0">
              {outlineTopics.map((topic, index) => (
                <View
                  className={`min-h-16 flex-row items-center gap-3 px-4 py-3 ${
                    index < outlineTopics.length - 1 ? 'border-b border-border' : ''
                  }`}
                  key={topic.id}>
                  <View className="h-9 w-9 items-center justify-center rounded-xl bg-surface-muted">
                    <Text className="text-sm font-black text-ink">{topic.id}</Text>
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text className="text-sm font-bold text-ink">{topic.title}</Text>
                    <Text className="mt-0.5 text-xs text-muted">{topic.subtitle}</Text>
                  </View>
                </View>
              ))}
            </Card>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}) {
  return (
    <View className="mt-4 flex-row items-start gap-3 border-t border-border pt-4">
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-surface-muted">
        <Ionicons color={colors.ink} name={icon} size={20} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-xs font-bold uppercase tracking-wide text-muted">{label}</Text>
        <Text className="mt-1 text-sm font-semibold leading-5 text-ink">{value}</Text>
      </View>
    </View>
  );
}
