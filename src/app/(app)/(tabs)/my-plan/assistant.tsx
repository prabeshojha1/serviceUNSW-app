import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import {
  AppScreen,
  Badge,
  Button,
  Card,
  InlineNotice,
  SectionHeader,
} from '@/components/ui/app-ui';
import { getCatalogCourse, usePlan } from '@/context/plan-context';
import { catalogCourses } from '@/data/plan';
import { colors } from '@/theme/tokens';

type Message = {
  id: number;
  role: 'assistant' | 'user';
  text: string;
};

const prompts = [
  'What should I take next term?',
  'Am I missing prerequisites?',
  'Which electives suit my interests?',
  'Will I graduate on time?',
];

export default function AssistantScreen() {
  const { course: courseCode } = useLocalSearchParams<{ course?: string }>();
  const courseContext = courseCode ? getCatalogCourse(courseCode) : undefined;
  const { completedUoc, remainingUoc } = usePlan();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      text: courseContext
        ? `I can help you assess ${courseContext.code} against your prerequisites, interests, and current degree plan.`
        : 'I can help you review prerequisites, workload, course choices, and your path through MyPlan.',
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
      text: answerFor(clean, completedUoc, remainingUoc, courseContext?.code),
    };
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInput('');
  };

  const recommendations = catalogCourses.filter((course) =>
    ['COMP3411', 'COMP6080', 'COMP3331'].includes(course.code),
  );

  return (
    <AppScreen back subtitle="Advice grounded in your current MyPlan" title="Planning assistant">
      <View className="gap-8">
        <InlineNotice
          action={
            <Button
              label="View planner"
              onPress={() => router.push('/my-plan/planner')}
              size="sm"
              variant="secondary"
            />
          }
          description={
            courseContext
              ? `Current course context: ${courseContext.code} · ${courseContext.title}`
              : `${completedUoc} UOC completed · ${remainingUoc} UOC remaining`
          }
          icon={courseContext ? 'book-outline' : 'map-outline'}
          title={courseContext ? 'Reviewing this course in your plan' : 'Using your current degree plan'}
          tone="ai"
        />

        <Card className="overflow-hidden p-0">
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
            {prompts.map((prompt) => (
              <Pressable
                accessibilityRole="button"
                className="rounded-full border border-ai/20 bg-ai-soft px-3 py-2 active:opacity-70"
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
              placeholder="Ask about courses, prerequisites, or your graduation plan"
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

        <View>
          <SectionHeader
            description="Open a recommendation to see the evidence and degree fit."
            title="Recommendations from your plan"
          />
          <View className="gap-3 md:flex-row">
            {recommendations.map((course) => (
              <Pressable
                accessibilityRole="button"
                className="min-w-0 flex-1 rounded-card border border-border bg-surface p-4 active:bg-ai-soft"
                key={course.code}
                onPress={() => router.push(`/my-plan/recommendation/${course.code}`)}>
                <View className="flex-row items-center justify-between gap-2">
                  <Badge label={course.code} tone="ai" />
                  <Ionicons color={colors.ai} name="chevron-forward" size={18} />
                </View>
                <Text className="mt-3 text-base font-extrabold text-ink">{course.title}</Text>
                <Text className="mt-2 text-sm leading-5 text-muted">
                  {recommendationReason(course.code)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </AppScreen>
  );
}

function answerFor(
  question: string,
  completedUoc: number,
  remainingUoc: number,
  courseCode?: string,
) {
  const lower = question.toLowerCase();
  if (courseCode) {
    const course = getCatalogCourse(courseCode);
    if (course) {
      return `${course.code} is offered in ${course.terms.length} planned study periods and lists ${
        course.prerequisites.join(' and ') || 'no formal prerequisites'
      }. Check the current Handbook before enrolling; adding it to MyPlan remains your decision.`;
    }
  }
  if (lower.includes('prerequisite')) {
    return 'Your planned courses have their listed prerequisites covered. COMP3411 is eligible because COMP2521 and MATH1081 are complete. Confirm the latest Handbook rules before enrolling.';
  }
  if (lower.includes('elective') || lower.includes('interest')) {
    return 'COMP3411 fits an AI interest, while COMP6080 adds practical front-end depth after COMP1531. COMP3331 is a strong option for systems and networking breadth.';
  }
  if (lower.includes('finish') || lower.includes('graduate') || lower.includes('time')) {
    return `You have completed ${completedUoc} UOC and have ${remainingUoc} UOC remaining. At 18 UOC per term, the current sequence is plausible, subject to course availability and degree rules.`;
  }
  return 'Start by checking prerequisite completion, whether each course is offered in the selected term, and whether the term stays at or below 18 UOC.';
}

function recommendationReason(code: string) {
  if (code === 'COMP3411') {
    return 'Both prerequisites are complete, it matches your AI interest, and it is available in an open future term.';
  }
  if (code === 'COMP6080') {
    return 'It builds on COMP1531 and complements your software engineering pathway with interface implementation.';
  }
  return 'It builds on COMP2521 and broadens your systems pathway before final-year project work.';
}
