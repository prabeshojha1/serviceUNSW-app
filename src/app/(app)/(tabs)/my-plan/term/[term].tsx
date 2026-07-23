import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import {
  AppScreen,
  Button,
  Card,
  EmptyState,
  InlineNotice,
  Metric,
  SectionHeader,
  StatusBadge,
} from '@/components/ui/app-ui';
import { usePlan } from '@/context/plan-context';
import { planTerms } from '@/data/plan';
import { colors } from '@/theme/tokens';
import { PlanTermId } from '@/types/plan';

export default function TermScreen() {
  const { term } = useLocalSearchParams<{ term: string }>();
  const termInfo = planTerms.find((item) => item.id === term);
  const { courses } = usePlan();

  if (!termInfo) {
    return (
      <AppScreen back title="Study period unavailable">
        <EmptyState
          action={<Button label="Open planner" onPress={() => router.replace('/my-plan/planner')} />}
          description="This study period is not available in the current plan."
          title="Term not found"
        />
      </AppScreen>
    );
  }

  const termCourses = courses.filter((course) => course.termId === termInfo.id);
  const termUoc = termCourses.reduce((sum, course) => sum + course.uoc, 0);
  const history = termInfo.id === 'completed';
  const loadPercent = history ? 100 : Math.round((termUoc / termInfo.capacity) * 100);

  return (
    <AppScreen
      action={
        !history ? (
          <Button
            icon="add"
            label="Add course"
            onPress={() =>
              router.push({
                pathname: '/my-plan/add-course',
                params: { term: termInfo.id },
              })
            }
            size="sm"
          />
        ) : undefined
      }
      back
      subtitle={history ? 'Academic history' : termInfo.year}
      title={termInfo.label}>
      <View className="gap-8">
        <Card>
          <View className="flex-row flex-wrap gap-6">
            <Metric label={history ? 'Courses passed' : 'Courses'} value={termCourses.length} />
            <Metric label={history ? 'UOC completed' : 'Study load'} value={`${termUoc} UOC`} />
            <Metric
              label="Status"
              value={history ? 'Complete' : termUoc > termInfo.capacity ? 'Overloaded' : 'Balanced'}
            />
          </View>
          {!history ? (
            <View className="mt-5 h-2.5 overflow-hidden rounded-full bg-surface-muted">
              <View
                className={`h-full rounded-full ${
                  termUoc > termInfo.capacity ? 'bg-warning' : 'bg-success'
                }`}
                style={{ width: `${Math.min(100, loadPercent)}%` }}
              />
            </View>
          ) : null}
        </Card>

        <View>
          <SectionHeader
            description={`${termCourses.length} ${
              termCourses.length === 1 ? 'course' : 'courses'
            } in this study period`}
            title={history ? 'Completed courses' : 'Planned courses'}
          />
          <View className="gap-3">
            {termCourses.length ? (
              termCourses.map((course) => (
                <Card className="p-0" key={course.id}>
                  <View className="flex-row flex-wrap items-center gap-4 p-4">
                    <View className="h-11 w-11 items-center justify-center rounded-xl bg-surface-muted">
                      <Ionicons
                        color={history ? colors.success : colors.ink}
                        name={history ? 'checkmark' : 'book-outline'}
                        size={21}
                      />
                    </View>
                    <View className="min-w-[200px] flex-1">
                      <Text className="text-sm font-black text-link">{course.code}</Text>
                      <Text className="mt-1 text-base font-extrabold text-ink">{course.title}</Text>
                    </View>
                    <StatusBadge status={course.status} />
                    <Button
                      label="Details"
                      onPress={() => router.push(`/courses/${course.code}`)}
                      size="sm"
                      variant="secondary"
                    />
                  </View>
                </Card>
              ))
            ) : (
              <EmptyState
                action={
                  !history ? (
                    <Button
                      label="Add a course"
                      onPress={() =>
                        router.push({
                          pathname: '/my-plan/add-course',
                          params: { term: termInfo.id },
                        })
                      }
                    />
                  ) : undefined
                }
                description="There are no courses in this study period."
                title="No courses yet"
              />
            )}
          </View>
        </View>

        {!history ? (
          <InlineNotice
            action={
              <Button
                label="Check with AI"
                onPress={() => router.push('/my-plan/assistant')}
                size="sm"
                variant="ai"
              />
            }
            description={
              termUoc > termInfo.capacity
                ? 'This term exceeds its suggested load. Ask the assistant to explore alternatives.'
                : 'Check prerequisites and workload balance before enrolment.'
            }
            icon="sparkles-outline"
            title={termUoc > termInfo.capacity ? 'This term may be overloaded' : 'Workload looks balanced'}
            tone={termUoc > termInfo.capacity ? 'warning' : 'ai'}
          />
        ) : null}
      </View>
    </AppScreen>
  );
}

export function isPlanTermId(value: string): value is PlanTermId {
  return planTerms.some((term) => term.id === value);
}
