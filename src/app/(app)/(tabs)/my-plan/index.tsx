import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import {
  AppScreen,
  Badge,
  Button,
  Card,
  InlineNotice,
  ProgressBar,
  SectionHeader,
  StatusBadge,
} from '@/components/ui/app-ui';
import { usePlan } from '@/context/plan-context';
import { catalogCourses, DEGREE_TOTAL_UOC, planTerms } from '@/data/plan';
import { colors } from '@/theme/tokens';

export default function MyPlanScreen() {
  const { completedUoc, courses, plannedUoc, remainingUoc } = usePlan();
  const progress = Math.round((completedUoc / DEGREE_TOTAL_UOC) * 100);
  const currentCourses = courses.filter((course) => course.termId === '2026-t1');
  const nextTerm = planTerms.find((term) => term.id === '2026-t2');
  const recommendations = catalogCourses.filter((course) =>
    ['COMP3411', 'COMP6080'].includes(course.code),
  );

  return (
    <AppScreen
      action={
        <Button
          icon="map-outline"
          label="Open planner"
          onPress={() => router.push('/my-plan/planner')}
          size="sm"
        />
      }
      subtitle="Bachelor of Computer Science"
      title="MyPlan">
      <View className="gap-8">
        <Card className="p-5 md:p-6" tone="ink">
          <View className="flex-row flex-wrap items-start justify-between gap-5">
            <View className="min-w-[220px] flex-1">
              <Text className="text-sm font-bold uppercase tracking-wide text-white/60">
                Degree progress
              </Text>
              <Text className="mt-2 text-4xl font-black text-white">{progress}% complete</Text>
              <Text className="mt-2 max-w-xl text-sm leading-5 text-white/65">
                Your plan contains {plannedUoc} UOC across current and future study periods.
              </Text>
            </View>
            <View className="h-24 w-24 items-center justify-center rounded-full border-8 border-brand">
              <Text className="text-2xl font-black text-white">{completedUoc}</Text>
              <Text className="text-xs text-white/60">of {DEGREE_TOTAL_UOC}</Text>
            </View>
          </View>
          <View className="mt-6">
            <ProgressBar value={progress} />
          </View>
          <View className="mt-6 flex-row gap-4 border-t border-white/15 pt-5">
            <DarkMetric label="Completed" value={completedUoc} />
            <DarkMetric label="Planned" value={plannedUoc} />
            <DarkMetric label="Remaining" value={remainingUoc} />
          </View>
        </Card>

        <View>
          <SectionHeader
            action={
              <Button
                label="View term"
                onPress={() => router.push('/my-plan/term/2026-t1')}
                size="sm"
                variant="ghost"
              />
            }
            description={`${currentCourses.reduce((sum, course) => sum + course.uoc, 0)} UOC in Term 1, 2026`}
            title="Current term"
          />
          <View className="gap-3 md:flex-row md:flex-wrap">
            {currentCourses.map((course) => (
              <Pressable
                accessibilityRole="button"
                key={course.id}
                onPress={() => router.push(`/courses/${course.code}`)}
                className="min-h-36 min-w-[240px] flex-1 rounded-card border border-border bg-surface p-4 active:bg-surface-raised">
                <View className="flex-row items-start justify-between gap-3">
                  <Text className="text-sm font-black text-link">{course.code}</Text>
                  <StatusBadge status={course.status} />
                </View>
                <Text className="mt-3 text-lg font-extrabold leading-6 text-ink">{course.title}</Text>
                <Text className="mt-2 text-sm text-muted">{course.uoc} UOC</Text>
              </Pressable>
            ))}

            {nextTerm ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push(`/my-plan/term/${nextTerm.id}`)}
                className="min-h-36 min-w-[240px] flex-1 rounded-card border border-brand-pressed/30 bg-brand-soft p-4 active:opacity-75">
                <Badge label="Up next" tone="warning" />
                <Text className="mt-3 text-lg font-extrabold text-ink">{nextTerm.label}</Text>
                <Text className="mt-2 text-sm text-muted">
                  {courses.filter((course) => course.termId === nextTerm.id).length} courses planned
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        <InlineNotice
          action={
            <Button
              icon="sparkles-outline"
              label="Check my plan"
              onPress={() => router.push('/my-plan/assistant')}
              size="sm"
              variant="ai"
            />
          }
          description="Review prerequisites, term availability, workload, and your path to graduation."
          icon="sparkles-outline"
          title="Is your plan on track?"
          tone="ai"
        />

        <View>
          <SectionHeader
            description="Based on your completed courses and current interests."
            title="Recommended for you"
          />
          <View className="gap-3 md:flex-row">
            {recommendations.map((course) => (
              <Pressable
                accessibilityRole="button"
                key={course.code}
                onPress={() => router.push(`/my-plan/recommendation/${course.code}`)}
                className="min-w-0 flex-1 rounded-card border border-ai/20 bg-surface p-4 active:bg-ai-soft">
                <View className="flex-row items-center justify-between gap-3">
                  <Text className="text-sm font-black text-ai">{course.code}</Text>
                  <Ionicons color={colors.ai} name="sparkles-outline" size={19} />
                </View>
                <Text className="mt-2 text-lg font-extrabold text-ink">{course.title}</Text>
                <Text className="mt-2 text-sm leading-5 text-muted">
                  {course.code === 'COMP3411'
                    ? 'Your prerequisites are complete and the course matches your AI interest.'
                    : 'Builds on COMP1531 and adds practical interface experience.'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View>
          <SectionHeader title="Degree requirement check" />
          <Card className="p-0">
            <RequirementRow label="Computer Science core" tone="info" value="8 of 12 courses" />
            <RequirementRow label="Computing electives" tone="info" value="3 of 5 courses" />
            <RequirementRow label="General education" tone="success" value="Complete" />
            <RequirementRow label="Free electives" tone="warning" value="12 UOC remaining" last />
          </Card>
        </View>
      </View>
    </AppScreen>
  );
}

function DarkMetric({ value, label }: { value: number; label: string }) {
  return (
    <View className="min-w-0 flex-1">
      <Text className="text-xl font-black text-white">{value}</Text>
      <Text className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/55">
        UOC {label}
      </Text>
    </View>
  );
}

function RequirementRow({
  label,
  value,
  tone,
  last = false,
}: {
  label: string;
  value: string;
  tone: 'info' | 'success' | 'warning';
  last?: boolean;
}) {
  const icon = tone === 'success' ? 'checkmark' : tone === 'warning' ? 'alert' : 'ellipsis-horizontal';
  const color = tone === 'success' ? colors.success : tone === 'warning' ? colors.warning : colors.info;
  return (
    <View className={`min-h-16 flex-row items-center gap-3 px-4 ${last ? '' : 'border-b border-border'}`}>
      <View className="h-9 w-9 items-center justify-center rounded-full bg-surface-muted">
        <Ionicons color={color} name={icon} size={18} />
      </View>
      <Text className="min-w-0 flex-1 text-sm font-bold text-ink">{label}</Text>
      <Text className="text-sm font-bold" style={{ color }}>
        {value}
      </Text>
    </View>
  );
}
