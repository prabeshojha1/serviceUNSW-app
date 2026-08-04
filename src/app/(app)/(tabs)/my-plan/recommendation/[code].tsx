import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/ui/native';

import {
  AppScreen,
  Badge,
  Button,
  Card,
  EmptyState,
  SectionHeader,
} from '@/components/ui/app-ui';
import { getCatalogCourse, getTermLabel, usePlan } from '@/context/plan-context';
import { colors } from '@/theme/tokens';

export default function RecommendationScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const course = getCatalogCourse(code);
  const { isCoursePlanned } = usePlan();

  if (!course) {
    return (
      <AppScreen back title="Recommendation unavailable">
        <EmptyState
          action={<Button label="Back to MyPlan" onPress={() => router.replace('/my-plan')} />}
          description="This course is no longer available in the recommendation catalogue."
          title="Recommendation not found"
        />
      </AppScreen>
    );
  }

  const planned = isCoursePlanned(course.code);

  return (
    <AppScreen back subtitle="MyPlan recommendation" title="Why this course fits">
      <View className="mx-auto w-full max-w-3xl gap-8">
        <Card>
          <View className="flex-row flex-wrap gap-2">
            <Badge label={course.code} tone="ai" />
            <Badge label={`${course.uoc} UOC`} />
            {planned ? <Badge label="Already in MyPlan" tone="success" /> : null}
          </View>
          <Text className="mt-4 text-3xl font-black tracking-tight text-ink">{course.title}</Text>
          <Text className="mt-3 text-base leading-7 text-muted">
            {course.description}
          </Text>
        </Card>

        <View>
          <SectionHeader title="Evidence from your plan" />
          <View className="gap-3 md:grid-cols-2">
            <Reason
              description={
                course.prerequisites.length
                  ? `${course.prerequisites.join(' and ')} are already complete.`
                  : 'No formal prerequisites are listed.'
              }
              icon="git-branch-outline"
              title="Prerequisites"
              tone="success"
            />
            <Reason
              description={`The course matches your ${course.interest.toLowerCase()} pathway.`}
              icon="heart-outline"
              title="Interest match"
              tone="ai"
            />
            <Reason
              description={`Available in ${course.terms.map(getTermLabel).join(', ')}.`}
              icon="calendar-outline"
              title="Term availability"
              tone="info"
            />
            <Reason
              description="Can contribute six units of credit to your remaining study plan."
              icon="school-outline"
              title="Degree fit"
              tone="warning"
            />
          </View>
        </View>

        <Card>
          <Text className="text-sm font-extrabold uppercase tracking-wide text-muted">
            How the assistant reasoned
          </Text>
          {[
            'Read completed courses and remaining degree requirements.',
            'Compared listed prerequisites with your academic history.',
            'Checked open future terms and your current study load.',
            'Matched the course interest area to your plan.',
          ].map((step, index) => (
            <View
              className={`flex-row items-start gap-3 py-4 ${
                index < 3 ? 'border-b border-border' : ''
              }`}
              key={step}>
              <View className="h-8 w-8 items-center justify-center rounded-full bg-ai-soft">
                <Text className="text-sm font-black text-ai">{index + 1}</Text>
              </View>
              <Text className="flex-1 pt-1 text-sm leading-5 text-ink">{step}</Text>
            </View>
          ))}
        </Card>

        <View className="flex-row flex-wrap gap-3">
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
            label="View course"
            onPress={() => router.push(`/courses/${course.code}`)}
            variant="secondary"
          />
          <Button
            label="Ask a follow-up"
            onPress={() =>
              router.push({
                pathname: '/my-plan',
                params: { assistant: '1', course: course.code },
              })
            }
            variant="ai"
          />
        </View>
      </View>
    </AppScreen>
  );
}

function Reason({
  icon,
  title,
  description,
  tone,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
  tone: 'success' | 'ai' | 'info' | 'warning';
}) {
  const color =
    tone === 'success'
      ? colors.success
      : tone === 'ai'
        ? colors.ai
        : tone === 'warning'
          ? colors.warning
          : colors.info;
  const background =
    tone === 'success'
      ? 'bg-success-soft'
      : tone === 'ai'
        ? 'bg-ai-soft'
        : tone === 'warning'
          ? 'bg-warning-soft'
          : 'bg-info-soft';
  return (
    <Card className="flex-1">
      <View className={`h-11 w-11 items-center justify-center rounded-xl ${background}`}>
        <Ionicons color={color} name={icon} size={21} />
      </View>
      <Text className="mt-3 text-base font-extrabold text-ink">{title}</Text>
      <Text className="mt-2 text-sm leading-5 text-muted">{description}</Text>
    </Card>
  );
}
