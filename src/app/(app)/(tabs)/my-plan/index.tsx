import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from '@/components/ui/native';

import {
  AppScreen,
  Badge,
  Button,
  Card,
  Chip,
  ChoiceRow,
  ModalSheet,
  ProgressBar,
  SectionHeader,
  StatusBadge,
} from '@/components/ui/app-ui';
import { getCatalogCourse, usePlan } from '@/context/plan-context';
import { DEGREE_TOTAL_UOC, planTerms } from '@/data/plan';
import { colors } from '@/theme/tokens';
import {
  CareerDirection,
  DegreeRequirementProgress,
  InterestId,
  PlanCourse,
  PlanningPreferences,
  PlanningPriority,
  PlanRecommendation,
  WorkloadPreference,
} from '@/types/plan';

type DrawerName = 'preferences' | 'requirements' | null;

const assistantPrompts = [
  'What should I take next term?',
  'Am I missing prerequisites?',
  'Which electives suit my goals?',
  'Will I graduate on time?',
];

export default function MyPlanScreen() {
  const params = useLocalSearchParams<{ assistant?: string; course?: string }>();
  const scrollRef = useRef<ScrollView | null>(null);
  const assistantY = useRef(0);
  const [assistantReady, setAssistantReady] = useState(false);
  const [openDrawer, setOpenDrawer] = useState<DrawerName>(null);
  const {
    completedUoc,
    courses,
    plannedUoc,
    preferences,
    recommendations,
    remainingUoc,
    requirements,
    unallocatedUoc,
    updatePreferences,
  } = usePlan();
  const [preferenceDraft, setPreferenceDraft] = useState<PlanningPreferences>(preferences);
  const progress = Math.round((completedUoc / DEGREE_TOTAL_UOC) * 100);
  const currentCourses = courses.filter((course) => course.termId === '2026-t1');
  const upcomingTerms = planTerms.filter((term) =>
    ['2026-t1', '2026-t2', '2026-t3'].includes(term.id),
  );

  useEffect(() => {
    if (params.assistant !== '1' || !assistantReady) return;
    const timeout = setTimeout(() => {
      scrollRef.current?.scrollTo({ animated: true, y: Math.max(0, assistantY.current - 24) });
    }, 120);
    return () => clearTimeout(timeout);
  }, [assistantReady, params.assistant]);

  const showPreferences = () => {
    setPreferenceDraft({
      ...preferences,
      interests: [...preferences.interests],
      priorities: [...preferences.priorities],
    });
    setOpenDrawer('preferences');
  };

  return (
    <AppScreen
      scrollViewRef={scrollRef}
      subtitle="Bachelor of Computer Science"
      title="MyPlan">
      <View className="gap-8">
        <Card className="p-5 md:p-6">
          <View className="flex-row flex-wrap items-start justify-between gap-5">
            <View className="min-w-[220px] flex-1">
              <Text className="text-sm font-bold uppercase tracking-wide text-muted">
                Degree progress
              </Text>
              <Text className="mt-2 text-4xl font-black text-ink">{progress}% complete</Text>
              <Text className="mt-2 max-w-xl text-sm leading-5 text-muted">
                {remainingUoc} UOC remain to complete your degree. You have allocated{' '}
                {plannedUoc} UOC to current and future terms.
              </Text>
            </View>
            <View className="h-24 w-24 items-center justify-center rounded-full border-8 border-brand">
              <Text className="text-2xl font-black text-ink">{completedUoc}</Text>
              <Text className="text-xs text-muted">of {DEGREE_TOTAL_UOC}</Text>
            </View>
          </View>
          <View className="mt-6">
            <ProgressBar value={progress} />
          </View>
          <View className="mt-6 flex-row gap-4 border-t border-border pt-5">
            <PlanMetric label="Completed" value={completedUoc} />
            <PlanMetric label="In your plan" value={plannedUoc} />
            <PlanMetric label="Unallocated" value={unallocatedUoc} />
          </View>
        </Card>

        <Card className="overflow-hidden p-5 md:p-6" tone="ink">
          <View className="flex-row flex-wrap items-start justify-between gap-5">
            <View className="min-w-[220px] flex-1">
              <View className="mb-4 h-12 w-12 items-center justify-center rounded-xl bg-brand">
                <Ionicons color={colors.ink} name="map-outline" size={25} />
              </View>
              <Text className="text-xs font-black uppercase tracking-widest text-brand">
                Your degree map
              </Text>
              <Text className="mt-2 max-w-xl text-2xl font-black leading-8 text-white md:text-3xl">
                Build the path to graduation
              </Text>
              <Text className="mt-2 max-w-2xl text-sm leading-5 text-white/65">
                See every term together, balance your workload, and decide which tailored
                suggestions belong in your plan.
              </Text>
            </View>
            <View className="self-stretch justify-end">
              <Button
                icon="arrow-forward"
                label="Open degree planner"
                onPress={() => router.push('/my-plan/planner')}
              />
            </View>
          </View>

          <View className="mt-6 flex-row flex-wrap gap-2 border-t border-white/15 pt-5">
            {upcomingTerms.map((term, index) => {
              const acceptedCourses = courses.filter((course) => course.termId === term.id);
              const suggestions = recommendations.filter((item) => item.termId === term.id).length;
              return (
                <View className="min-w-[150px] flex-1 rounded-xl bg-white/10 p-3" key={term.id}>
                  <Text className="text-xs font-bold uppercase tracking-wide text-white/55">
                    {index === 0 ? 'Current term' : index === 1 ? 'Next term' : 'Later'}
                  </Text>
                  <Text className="mt-1 text-base font-black text-white">{term.shortLabel}</Text>
                  <Text className="mt-1 text-xs leading-4 text-white/60">
                    {acceptedCourses.length}{' '}
                    {acceptedCourses.length === 1 ? 'course' : 'courses'}
                    {suggestions ? ` · ${suggestions} suggestion${suggestions === 1 ? '' : 's'}` : ''}
                  </Text>
                </View>
              );
            })}
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
          </View>
        </View>

        <View>
          <SectionHeader
            description="Keep the inputs and rules behind your plan together."
            title="Plan settings"
          />
          <View className="gap-3 lg:flex-row">
            <PreferencesSummary preferences={preferences} onPress={showPreferences} />
            <RequirementsSummary
              onPress={() => setOpenDrawer('requirements')}
              requirements={requirements}
            />
          </View>
        </View>

        <View
          onLayout={(event) => {
            assistantY.current = event.nativeEvent.layout.y;
            setAssistantReady(true);
          }}>
          <PlanningAssistant
            courseCode={params.course}
            courses={courses}
            key={params.course ?? 'general'}
            preferences={preferences}
            recommendations={recommendations}
            remainingUoc={remainingUoc}
            requirements={requirements}
          />
        </View>
      </View>

      <PreferencesDrawer
        draft={preferenceDraft}
        onCancel={() => setOpenDrawer(null)}
        onChange={setPreferenceDraft}
        onSave={() => {
          updatePreferences(preferenceDraft);
          setOpenDrawer(null);
        }}
        visible={openDrawer === 'preferences'}
      />
      <RequirementsDrawer
        courses={courses}
        onClose={() => setOpenDrawer(null)}
        requirements={requirements}
        visible={openDrawer === 'requirements'}
      />
    </AppScreen>
  );
}

function PlanMetric({ value, label }: { value: number; label: string }) {
  return (
    <View className="min-w-0 flex-1">
      <Text className="text-xl font-black text-ink">{value}</Text>
      <Text className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">
        UOC {label}
      </Text>
    </View>
  );
}

function PreferencesSummary({
  onPress,
  preferences,
}: {
  onPress: () => void;
  preferences: PlanningPreferences;
}) {
  return (
    <Pressable
      accessibilityHint="Opens planning preference editor"
      accessibilityRole="button"
      className="min-w-0 flex-1 rounded-card border border-ai/20 bg-surface p-5 active:bg-ai-soft"
      onPress={onPress}>
      <View className="flex-row items-start gap-4">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-ai-soft">
          <Ionicons color={colors.ai} name="options-outline" size={22} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-lg font-extrabold text-ink">Planning preferences</Text>
          <Text className="mt-1 text-sm leading-5 text-muted">
            Signals used to shape course suggestions and workload advice.
          </Text>
        </View>
        <View className="flex-row items-center gap-1 rounded-full bg-ai-soft px-3 py-2">
          <Ionicons color={colors.ai} name="pencil" size={14} />
          <Text className="text-xs font-bold text-ai">Edit</Text>
        </View>
      </View>
      <View className="mt-5 flex-row flex-wrap gap-3">
        <PreferenceSignal
          label="Career direction"
          tone="ai"
          value={careerLabels[preferences.careerDirection]}
        />
        <PreferenceSignal
          label="Target workload"
          tone="success"
          value={workloadLabels[preferences.workload]}
        />
        <PreferenceSignal
          label="Course interests"
          tone="info"
          value={preferences.interests.map((interest) => interestLabels[interest]).join(' · ')}
        />
        <PreferenceSignal
          label="Top priority"
          tone="brand"
          value={
            preferences.priorities.length
              ? priorityLabels[preferences.priorities[0]]
              : 'No priority selected'
          }
        />
      </View>
    </Pressable>
  );
}

function PreferenceSignal({
  label,
  tone,
  value,
}: {
  label: string;
  tone: 'ai' | 'success' | 'info' | 'brand';
  value: string;
}) {
  const containerClass =
    tone === 'ai'
      ? 'border-ai/20 bg-ai-soft'
      : tone === 'success'
        ? 'border-success/20 bg-success-soft'
        : tone === 'info'
          ? 'border-info/20 bg-info-soft'
          : 'border-brand-pressed/30 bg-brand-soft';
  const labelClass =
    tone === 'ai'
      ? 'text-ai'
      : tone === 'success'
        ? 'text-success'
        : tone === 'info'
          ? 'text-info'
          : 'text-warning';
  return (
    <View className={`min-w-[160px] flex-1 rounded-xl border p-3 ${containerClass}`}>
      <Text className={`text-xs font-bold uppercase tracking-wide ${labelClass}`}>{label}</Text>
      <Text className="mt-1.5 text-sm font-extrabold leading-5 text-ink">{value}</Text>
    </View>
  );
}

function RequirementsSummary({
  onPress,
  requirements,
}: {
  onPress: () => void;
  requirements: DegreeRequirementProgress[];
}) {
  const allocated = requirements.reduce(
    (sum, requirement) => sum + requirement.completedUoc + requirement.plannedUoc,
    0,
  );
  return (
    <Pressable
      accessibilityHint="Opens degree requirement details"
      accessibilityRole="button"
      className="min-w-0 flex-1 rounded-card border border-brand-pressed/30 bg-surface p-5 active:bg-brand-soft"
      onPress={onPress}>
      <View className="flex-row items-start gap-4">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-brand-soft">
          <Ionicons color={colors.ink} name="checkmark-done-outline" size={22} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-lg font-extrabold text-ink">Degree requirements</Text>
          <Text className="mt-1 text-sm leading-5 text-muted">
            {allocated} of {DEGREE_TOTAL_UOC} UOC completed or placed in your plan.
          </Text>
        </View>
        <View className="flex-row items-center gap-1 rounded-full bg-brand-soft px-3 py-2">
          <Text className="text-xs font-bold text-ink">View details</Text>
          <Ionicons color={colors.ink} name="chevron-forward" size={14} />
        </View>
      </View>
      <View className="mt-5 gap-3">
        {requirements.slice(0, 3).map((requirement) => {
          const allocatedUoc = requirement.completedUoc + requirement.plannedUoc;
          return (
            <View key={requirement.id}>
              <View className="mb-1.5 flex-row justify-between gap-3">
                <Text className="text-xs font-bold text-muted">{requirement.label}</Text>
                <Text className="text-xs font-bold text-ink">
                  {allocatedUoc}/{requirement.requiredUoc} UOC
                </Text>
              </View>
              <ProgressBar value={(allocatedUoc / requirement.requiredUoc) * 100} tone="info" />
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

type Message = { id: number; role: 'assistant' | 'user'; text: string };

function PlanningAssistant({
  courseCode,
  courses,
  preferences,
  recommendations,
  remainingUoc,
  requirements,
}: {
  courseCode?: string;
  courses: PlanCourse[];
  preferences: PlanningPreferences;
  recommendations: PlanRecommendation[];
  remainingUoc: number;
  requirements: DegreeRequirementProgress[];
}) {
  const courseContext = courseCode ? getCatalogCourse(courseCode) : undefined;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      text: courseContext
        ? `I’m looking at ${courseContext.code} alongside your preferences and current degree plan. What would you like to check?`
        : `I can see your current plan, ${careerLabels[preferences.careerDirection].toLowerCase()} direction, and remaining degree requirements. What should we work through?`,
    },
  ]);
  const nextId = useRef(2);

  const send = (question: string) => {
    const clean = question.trim();
    if (!clean) return;
    const userMessage: Message = { id: nextId.current++, role: 'user', text: clean };
    const assistantMessage: Message = {
      id: nextId.current++,
      role: 'assistant',
      text: answerForPlan(
        clean,
        courses,
        preferences,
        recommendations,
        remainingUoc,
        requirements,
        courseContext?.code,
      ),
    };
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInput('');
  };

  return (
    <View>
      <SectionHeader
        description="Ask questions grounded in your plan, preferences, and requirement gaps."
        title="Planning assistant"
      />
      <Card className="overflow-hidden border-ai/20 p-0">
        <View className="flex-row flex-wrap items-center gap-4 border-b border-ai/20 bg-ai-soft p-4 md:px-6">
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-ai">
            <Ionicons color={colors.white} name="sparkles" size={21} />
          </View>
          <View className="min-w-[200px] flex-1">
            <Text className="text-base font-extrabold text-ink">Using your live MyPlan</Text>
            <Text className="mt-1 text-xs leading-4 text-muted">
              {recommendations.length} active suggestions · {remainingUoc} UOC left to complete ·{' '}
              {workloadLabels[preferences.workload]} workload
            </Text>
          </View>
          <Button
            label="View suggestions"
            onPress={() => router.push('/my-plan/planner')}
            size="sm"
            variant="ai"
          />
        </View>

        <View className="min-h-72 gap-4 p-4 md:p-6">
          {messages.map((message) => (
            <View
              className={`max-w-[88%] flex-row items-end gap-2 ${
                message.role === 'user' ? 'self-end' : 'self-start'
              }`}
              key={message.id}>
              {message.role === 'assistant' ? (
                <View className="h-8 w-8 items-center justify-center rounded-full bg-ai">
                  <Ionicons color={colors.white} name="sparkles" size={15} />
                </View>
              ) : null}
              <View
                className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user' ? 'rounded-br-md bg-ink' : 'rounded-bl-md bg-surface-muted'
                }`}>
                <Text
                  className={`text-sm leading-6 ${
                    message.role === 'user' ? 'text-white' : 'text-ink'
                  }`}>
                  {message.text}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="flex-row flex-wrap gap-2 border-t border-border px-4 py-3">
          {assistantPrompts.map((prompt) => (
            <Pressable
              accessibilityRole="button"
              className="min-h-10 justify-center rounded-full border border-ai/20 bg-ai-soft px-3 py-2 active:opacity-70"
              key={prompt}
              onPress={() => send(prompt)}>
              <Text className="text-xs font-bold text-ai">{prompt}</Text>
            </Pressable>
          ))}
        </View>

        <View className="flex-row items-end gap-3 border-t border-border bg-surface-raised p-3">
          <TextInput
            accessibilityLabel="Ask the planning assistant"
            className="max-h-32 min-h-12 flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-base text-ink outline-none focus:border-link"
            multiline
            onChangeText={setInput}
            onSubmitEditing={() => send(input)}
            placeholder="Ask about courses, prerequisites, or graduation"
            placeholderTextColor={colors.muted}
            value={input}
          />
          <Pressable
            accessibilityLabel="Send message"
            accessibilityRole="button"
            accessibilityState={{ disabled: !input.trim() }}
            className={`h-12 w-12 items-center justify-center rounded-xl bg-ai ${
              input.trim() ? 'active:opacity-70' : 'opacity-35'
            }`}
            disabled={!input.trim()}
            onPress={() => send(input)}>
            <Ionicons color={colors.white} name="arrow-up" size={21} />
          </Pressable>
        </View>
        <Text className="px-4 pb-3 text-center text-xs leading-4 text-muted">
          Planning guidance is illustrative. Confirm official rules in the UNSW Handbook or with
          an academic adviser.
        </Text>
      </Card>
    </View>
  );
}

function PreferencesDrawer({
  draft,
  onCancel,
  onChange,
  onSave,
  visible,
}: {
  draft: PlanningPreferences;
  onCancel: () => void;
  onChange: (preferences: PlanningPreferences) => void;
  onSave: () => void;
  visible: boolean;
}) {
  return (
    <ModalSheet
      description="Changes update your course suggestions and assistant advice for this session."
      footer={
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button fullWidth label="Cancel" onPress={onCancel} variant="secondary" />
          </View>
          <View className="flex-1">
            <Button fullWidth icon="checkmark" label="Save changes" onPress={onSave} />
          </View>
        </View>
      }
      onClose={onCancel}
      presentation="responsive-drawer"
      title="Edit planning preferences"
      visible={visible}>
      <PreferenceGroup
        description="Choose the direction recommendations should support."
        title="Career direction">
        {careerOptions.map((option) => (
          <ChoiceRow
            description={option.description}
            key={option.value}
            label={option.label}
            onPress={() => onChange({ ...draft, careerDirection: option.value })}
            selected={draft.careerDirection === option.value}
          />
        ))}
      </PreferenceGroup>

      <PreferenceGroup
        description="Select every subject area you would like to see represented."
        title="Course interests">
        <View className="flex-row flex-wrap gap-2">
          {interestOptions.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              onPress={() =>
                onChange({
                  ...draft,
                  interests: toggleValue(draft.interests, option.value),
                })
              }
              selected={draft.interests.includes(option.value)}
            />
          ))}
        </View>
      </PreferenceGroup>

      <PreferenceGroup
        description="Set the load the planner should protect where possible."
        title="Target workload">
        {workloadOptions.map((option) => (
          <ChoiceRow
            description={option.description}
            key={option.value}
            label={option.label}
            onPress={() => onChange({ ...draft, workload: option.value })}
            selected={draft.workload === option.value}
          />
        ))}
      </PreferenceGroup>

      <PreferenceGroup
        description="These priorities influence recommendation explanations and planning advice."
        title="Planning priorities">
        <View className="flex-row flex-wrap gap-2">
          {priorityOptions.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              onPress={() =>
                onChange({
                  ...draft,
                  priorities: toggleValue(draft.priorities, option.value),
                })
              }
              selected={draft.priorities.includes(option.value)}
            />
          ))}
        </View>
      </PreferenceGroup>
    </ModalSheet>
  );
}

function PreferenceGroup({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <View>
      <Text className="text-base font-extrabold text-ink">{title}</Text>
      <Text className="mb-3 mt-1 text-xs leading-4 text-muted">{description}</Text>
      <View className="gap-2">{children}</View>
    </View>
  );
}

function RequirementsDrawer({
  courses,
  onClose,
  requirements,
  visible,
}: {
  courses: PlanCourse[];
  onClose: () => void;
  requirements: DegreeRequirementProgress[];
  visible: boolean;
}) {
  return (
    <ModalSheet
      description="See how completed and accepted planned courses contribute to your degree."
      footer={<Button fullWidth label="Close" onPress={onClose} variant="secondary" />}
      onClose={onClose}
      presentation="responsive-drawer"
      title="Degree requirement check"
      visible={visible}>
      {requirements.map((requirement) => {
        const completed = courses.filter(
          (course) => course.requirementId === requirement.id && course.status === 'completed',
        );
        const planned = courses.filter(
          (course) =>
            course.requirementId === requirement.id &&
            (course.status === 'planned' || course.status === 'in-progress'),
        );
        const allocated = requirement.completedUoc + requirement.plannedUoc;
        return (
          <Card key={requirement.id}>
            <View className="flex-row items-start justify-between gap-3">
              <View className="min-w-0 flex-1">
                <Text className="text-base font-extrabold text-ink">{requirement.label}</Text>
                <Text className="mt-1 text-xs leading-4 text-muted">{requirement.description}</Text>
              </View>
              <Badge
                label={requirement.outstandingUoc ? `${requirement.outstandingUoc} UOC left` : 'Allocated'}
                tone={requirement.outstandingUoc ? 'warning' : 'success'}
              />
            </View>
            <View className="mt-4">
              <ProgressBar value={(allocated / requirement.requiredUoc) * 100} tone="info" />
            </View>
            <View className="mt-4 gap-2 border-t border-border pt-4">
              <RequirementContribution
                label="Completed"
                tone="success"
                value={completed.length ? completed.map((course) => course.code).join(', ') : 'None yet'}
              />
              <RequirementContribution
                label="In your plan"
                tone="info"
                value={planned.length ? planned.map((course) => course.code).join(', ') : 'None yet'}
              />
              <RequirementContribution
                label="Outstanding"
                tone="warning"
                value={`${requirement.outstandingUoc} UOC`}
              />
            </View>
          </Card>
        );
      })}
      <View className="flex-row items-start gap-3 rounded-card border border-warning/20 bg-warning-soft p-4">
        <Ionicons color={colors.warning} name="information-circle-outline" size={21} />
        <Text className="min-w-0 flex-1 text-xs leading-5 text-muted">
          This prototype check is illustrative, not an official progression audit. Confirm your
          program rules in the current UNSW Handbook or with an academic adviser.
        </Text>
      </View>
    </ModalSheet>
  );
}

function RequirementContribution({
  label,
  tone,
  value,
}: {
  label: string;
  tone: 'success' | 'info' | 'warning';
  value: string;
}) {
  return (
    <View className="flex-row items-start gap-3">
      <Badge label={label} tone={tone} />
      <Text className="min-w-0 flex-1 pt-1 text-xs leading-4 text-muted">{value}</Text>
    </View>
  );
}

function answerForPlan(
  question: string,
  courses: PlanCourse[],
  preferences: PlanningPreferences,
  recommendations: PlanRecommendation[],
  remainingUoc: number,
  requirements: DegreeRequirementProgress[],
  courseCode?: string,
) {
  const lower = question.toLowerCase();
  const completedCodes = courses
    .filter((course) => course.status === 'completed')
    .map((course) => course.code);
  if (courseCode) {
    const course = getCatalogCourse(courseCode);
    if (course) {
      const prerequisitesComplete = course.prerequisites.every((code) => completedCodes.includes(code));
      return `${course.code} is ${prerequisitesComplete ? 'eligible based on the listed prerequisites' : 'still missing one or more listed prerequisites'} and aligns with ${course.interest.toLowerCase()}. Confirm current availability and rules in the Handbook.`;
    }
  }
  if (lower.includes('prerequisite')) {
    const eligible = recommendations.map((item) => item.course.code).join(', ');
    return eligible
      ? `${eligible} currently have their listed prerequisites covered. Purple suggestions stay outside your UOC totals until you accept them.`
      : 'Your current plan has no outstanding recommendation with all listed prerequisites complete.';
  }
  if (lower.includes('elective') || lower.includes('goal') || lower.includes('interest')) {
    const choices = recommendations.slice(0, 2).map((item) => item.course.code).join(' and ');
    return choices
      ? `${choices} best match your ${careerLabels[preferences.careerDirection].toLowerCase()} direction and selected interests. Open the degree planner to review the evidence and accept or dismiss each suggestion.`
      : 'You have no active elective suggestions. Edit your planning preferences to broaden the pathways I should consider.';
  }
  if (lower.includes('finish') || lower.includes('graduate') || lower.includes('time')) {
    const outstanding = requirements.filter((item) => item.outstandingUoc > 0);
    return `You have ${remainingUoc} UOC left to complete and ${outstanding.length} requirement areas still need allocation. Your ${workloadLabels[preferences.workload].toLowerCase()} workload preference is reflected in suggested term placement.`;
  }
  const nextRecommendation = recommendations[0];
  return nextRecommendation
    ? `Start with ${nextRecommendation.course.code} in ${planTerms.find((term) => term.id === nextRecommendation.termId)?.shortLabel}. ${nextRecommendation.reason}`
    : 'Your accepted plan is currently aligned with your selected preferences. Check requirement gaps before adding another course.';
}

function toggleValue<T>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

const careerLabels: Record<CareerDirection, string> = {
  'ai-ml': 'AI / ML engineer',
  'software-engineering': 'Software engineer',
  data: 'Data specialist',
  cybersecurity: 'Cybersecurity',
  'product-ux': 'Product / UX',
  research: 'Research / academia',
  exploring: 'Exploring options',
};

const interestLabels: Record<InterestId, string> = {
  ai: 'AI',
  data: 'Data',
  'software-engineering': 'Software engineering',
  web: 'Web',
  systems: 'Systems',
  networks: 'Networks',
  'product-design': 'Product design',
};

const workloadLabels: Record<WorkloadPreference, string> = {
  light: 'Light · 6–12 UOC',
  balanced: 'Balanced · 18 UOC',
  flexible: 'Flexible by term',
};

const priorityLabels: Record<PlanningPriority, string> = {
  'prerequisites-first': 'Prerequisites first',
  'graduate-on-time': 'Graduate on time',
  'protect-wam': 'Protect WAM',
  'practical-experience': 'Practical experience',
  'manage-workload': 'Manage workload',
};

const careerOptions: { value: CareerDirection; label: string; description: string }[] = [
  { value: 'ai-ml', label: careerLabels['ai-ml'], description: 'Machine learning, intelligent systems, and supporting data foundations.' },
  { value: 'software-engineering', label: careerLabels['software-engineering'], description: 'Scalable software, team delivery, systems, and web engineering.' },
  { value: 'data', label: careerLabels.data, description: 'Data modelling, analytics, databases, and applied AI.' },
  { value: 'cybersecurity', label: careerLabels.cybersecurity, description: 'Secure systems, networks, and infrastructure.' },
  { value: 'product-ux', label: careerLabels['product-ux'], description: 'Human-centred products, interface design, and implementation.' },
  { value: 'research', label: careerLabels.research, description: 'Theory, advanced technical depth, and postgraduate preparation.' },
  { value: 'exploring', label: careerLabels.exploring, description: 'Keep recommendations broad while you compare pathways.' },
];

const interestOptions = (Object.keys(interestLabels) as InterestId[]).map((value) => ({
  label: interestLabels[value],
  value,
}));

const workloadOptions: { value: WorkloadPreference; label: string; description: string }[] = [
  { value: 'light', label: workloadLabels.light, description: 'Leave more room for work, wellbeing, or difficult courses.' },
  { value: 'balanced', label: workloadLabels.balanced, description: 'Aim for the standard three-course term where possible.' },
  { value: 'flexible', label: workloadLabels.flexible, description: 'Let course availability and sequencing determine each term.' },
];

const priorityOptions = (Object.keys(priorityLabels) as PlanningPriority[]).map((value) => ({
  label: priorityLabels[value],
  value,
}));
