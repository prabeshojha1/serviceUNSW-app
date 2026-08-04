import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from '@/components/ui/native';

import {
  AppScreen,
  Badge,
  Button,
  Card,
  EmptyState,
  ModalSheet,
  SectionHeader,
  StatusBadge,
} from '@/components/ui/app-ui';
import { usePlan } from '@/context/plan-context';
import { planTerms } from '@/data/plan';
import { colors } from '@/theme/tokens';
import { PlanCourse, PlanRecommendation, PlanTermId } from '@/types/plan';

export default function PlannerScreen() {
  const {
    acceptRecommendation,
    courses,
    moveCourse,
    recommendations,
    rejectRecommendation,
  } = usePlan();
  const [movingCourse, setMovingCourse] = useState<PlanCourse | null>(null);
  const futureTerms = planTerms.filter((term) => term.id !== 'completed');
  const completed = courses.filter((course) => course.termId === 'completed');

  return (
    <AppScreen
      action={
        <Button
          icon="add"
          label="Add course"
          onPress={() => router.push('/my-plan/add-course')}
          size="sm"
        />
      }
      back
      subtitle="Arrange your accepted courses and review suggestions"
      title="Degree planner">
      <View className="gap-6">
        <View className="flex-row flex-wrap items-center gap-3 rounded-card border border-ai/20 bg-ai-soft p-4">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-surface">
            <Ionicons color={colors.ai} name="sparkles-outline" size={21} />
          </View>
          <View className="min-w-[220px] flex-1">
            <Text className="text-sm font-extrabold text-ink">Suggestions need your approval</Text>
            <Text className="mt-1 text-xs leading-4 text-muted">
              Purple dashed courses are matched to your preferences. They do not count toward your
              study load until you accept them.
            </Text>
          </View>
          <Badge
            label={`${recommendations.length} ${recommendations.length === 1 ? 'suggestion' : 'suggestions'}`}
            tone="ai"
          />
        </View>

        <View>
          <SectionHeader
            action={
              <View className="flex-row items-center gap-1">
                <Text className="text-xs font-bold text-muted">Scroll through terms</Text>
                <Ionicons color={colors.muted} name="arrow-forward" size={16} />
              </View>
            }
            description="Move accepted courses between available study periods."
            title="Your term sequence"
          />
          <ScrollView
            horizontal
            contentContainerClassName="items-start gap-3 pb-3"
            decelerationRate="fast"
            showsHorizontalScrollIndicator
            snapToAlignment="start"
            snapToInterval={300}>
            {futureTerms.map((term) => {
              const termCourses = courses.filter((course) => course.termId === term.id);
              const termRecommendations = recommendations.filter((item) => item.termId === term.id);
              const termUoc = termCourses.reduce((sum, course) => sum + course.uoc, 0);
              return (
                <View
                  className="min-h-[420px] w-72 rounded-panel border border-border bg-surface-muted p-3"
                  key={term.id}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push(`/my-plan/term/${term.id}`)}
                    className="min-h-16 flex-row items-center justify-between gap-3 px-1 active:opacity-70">
                    <View>
                      <Text className="text-xs font-bold uppercase tracking-wide text-muted">
                        {term.year}
                      </Text>
                      <Text className="mt-1 text-xl font-black text-ink">{term.shortLabel}</Text>
                    </View>
                    <View
                      className={`rounded-full px-3 py-2 ${
                        termUoc >= term.capacity ? 'bg-warning-soft' : 'bg-surface'
                      }`}>
                      <Text className="text-xs font-bold text-muted">
                        {termUoc}/{term.capacity} UOC
                      </Text>
                    </View>
                  </Pressable>

                  <View className="mt-2 flex-1 gap-2">
                    {termCourses.map((course) => (
                      <PlannerCourse
                        course={course}
                        key={course.id}
                        onMove={() => setMovingCourse(course)}
                      />
                    ))}
                    {termRecommendations.map((recommendation) => (
                      <PlannerRecommendationCard
                        key={recommendation.course.code}
                        onAccept={() => acceptRecommendation(recommendation.course.code)}
                        onReject={() => rejectRecommendation(recommendation.course.code)}
                        recommendation={recommendation}
                      />
                    ))}
                    {!termCourses.length && !termRecommendations.length ? (
                      <EmptyState
                        action={
                          <Button
                            label="Add course"
                            onPress={() =>
                              router.push({
                                pathname: '/my-plan/add-course',
                                params: { term: term.id },
                              })
                            }
                            size="sm"
                            variant="secondary"
                          />
                        }
                        description="This study period is currently open."
                        icon="add-circle-outline"
                        title="No courses yet"
                      />
                    ) : null}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View>
          <SectionHeader
            action={
              <Button
                icon="document-attach-outline"
                label="Import transcript"
                onPress={() => {}}
                size="sm"
                variant="secondary"
              />
            }
            description="Import an academic transcript PDF to prefill completed courses and degree progress."
            title="Academic history"
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/my-plan/term/completed')}
            className="min-h-20 flex-row items-center gap-4 rounded-card border border-border bg-surface p-4 active:bg-surface-raised">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-success-soft">
              <Ionicons color={colors.success} name="checkmark" size={22} />
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-base font-extrabold text-ink">Completed courses</Text>
              <Text className="mt-1 text-sm text-muted">
                {completed.length} courses ·{' '}
                {completed.reduce((sum, course) => sum + course.uoc, 0)} UOC
              </Text>
            </View>
            <Ionicons color={colors.muted} name="chevron-forward" size={18} />
          </Pressable>
        </View>
      </View>

      <MoveCourseSheet
        course={movingCourse}
        onClose={() => setMovingCourse(null)}
        onMove={(termId) => {
          if (movingCourse) moveCourse(movingCourse.id, termId);
          setMovingCourse(null);
        }}
      />
    </AppScreen>
  );
}

function PlannerCourse({ course, onMove }: { course: PlanCourse; onMove: () => void }) {
  return (
    <Card className="p-3">
      <View className="flex-row items-start justify-between gap-2">
        <Text className="text-sm font-black text-link">{course.code}</Text>
        <StatusBadge status={course.status} />
      </View>
      <Text className="mt-2 text-base font-extrabold leading-5 text-ink">{course.title}</Text>
      <Text className="mt-2 text-xs text-muted">{course.uoc} UOC</Text>
      <View className="mt-3 flex-row gap-2 border-t border-border pt-3">
        <View className="flex-1">
          <Button fullWidth label="Move" onPress={onMove} size="sm" variant="secondary" />
        </View>
        <View className="flex-1">
          <Button
            fullWidth
            label="Details"
            onPress={() => router.push(`/courses/${course.code}`)}
            size="sm"
            variant="ghost"
          />
        </View>
      </View>
    </Card>
  );
}

function PlannerRecommendationCard({
  onAccept,
  onReject,
  recommendation,
}: {
  onAccept: () => void;
  onReject: () => void;
  recommendation: PlanRecommendation;
}) {
  const { course, reason } = recommendation;
  return (
    <View
      className="rounded-card border-2 border-ai/50 bg-ai-soft p-3"
      style={{ borderStyle: 'dashed' }}>
      <View className="flex-row items-start justify-between gap-2">
        <Text className="text-sm font-black text-ai">{course.code}</Text>
        <Badge label="Recommended" tone="ai" />
      </View>
      <Text className="mt-2 text-base font-extrabold leading-5 text-ink">{course.title}</Text>
      <Text className="mt-2 text-xs leading-4 text-muted">{reason}</Text>
      <View className="mt-3 gap-2 border-t border-ai/20 pt-3">
        <Button
          fullWidth
          icon="checkmark"
          label="Accept recommendation"
          onPress={onAccept}
          size="sm"
          variant="ai"
        />
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Button fullWidth label="Not for me" onPress={onReject} size="sm" variant="ghost" />
          </View>
          <View className="flex-1">
            <Button
              fullWidth
              label="Details"
              onPress={() => router.push(`/my-plan/recommendation/${course.code}`)}
              size="sm"
              variant="secondary"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function MoveCourseSheet({
  course,
  onClose,
  onMove,
}: {
  course: PlanCourse | null;
  onClose: () => void;
  onMove: (term: PlanTermId) => void;
}) {
  return (
    <ModalSheet
      description="The overview and term pages update immediately."
      footer={<Button fullWidth label="Cancel" onPress={onClose} variant="secondary" />}
      onClose={onClose}
      title={course ? `Move ${course.code}` : 'Move course'}
      visible={!!course}>
      {planTerms
        .filter((term) => term.id !== 'completed')
        .map((term) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: term.id === course?.termId }}
            className={`min-h-16 flex-row items-center gap-3 rounded-xl border p-3 ${
              term.id === course?.termId
                ? 'border-border bg-surface-muted opacity-50'
                : 'border-border bg-surface active:bg-surface-raised'
            }`}
            disabled={term.id === course?.termId}
            key={term.id}
            onPress={() => onMove(term.id)}>
            <View className="min-w-0 flex-1">
              <Text className="text-sm font-bold text-ink">{term.label}</Text>
              <Text className="mt-1 text-xs text-muted">{term.year}</Text>
            </View>
            <Text className="text-xs font-bold text-link">
              {term.id === course?.termId ? 'Current term' : 'Move here'}
            </Text>
          </Pressable>
        ))}
    </ModalSheet>
  );
}
