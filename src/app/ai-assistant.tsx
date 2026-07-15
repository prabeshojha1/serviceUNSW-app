import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AIRecommendationCard } from '@/components/ai-recommendation-card';
import { AppShell, SecondaryButton, palette, sharedStyles } from '@/components/plan-ui';
import { usePlan } from '@/context/plan-context';
import { catalogCourses } from '@/data/plan';

interface Message { id: number; role: 'assistant' | 'user'; text: string }

const prompts = [
  'What should I take next term?',
  'Am I missing any prerequisites?',
  'Which electives suit my interests?',
  'Will I finish my degree on time?',
];

export default function AIAssistantScreen() {
  const { courses, completedUoc, remainingUoc } = usePlan();
  const [input, setInput] = useState('');
  const nextMessageId = useRef(2);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      text: `Hi Alex — I’ve reviewed your ${courses.length}-course plan. I can help balance terms, check prerequisites, and explain recommendations. What would you like to plan?`,
    },
  ]);
  const recommendations = catalogCourses.filter((course) => ['COMP3411', 'COMP6080', 'COMP3331'].includes(course.code));

  const send = (text: string) => {
    const question = text.trim();
    if (!question) return;
    const userMessageId = nextMessageId.current++;
    const assistantMessageId = nextMessageId.current++;
    setMessages((current) => [
      ...current,
      { id: userMessageId, role: 'user', text: question },
      { id: assistantMessageId, role: 'assistant', text: answerFor(question, completedUoc, remainingUoc) },
    ]);
    setInput('');
  };

  return (
    <AppShell title="Planning assistant" eyebrow="MyPlan AI" showBack>
      <View style={styles.contextBar}>
        <View style={styles.contextIcon}><Text style={styles.contextIconText}>▦</Text></View>
        <View style={styles.contextBody}>
          <Text style={styles.contextTitle}>Using your current degree plan</Text>
          <Text style={styles.contextText}>{completedUoc} UOC completed · {remainingUoc} UOC remaining · plan changes stay under your control</Text>
        </View>
        <SecondaryButton label="View plan" onPress={() => router.push('/planner')} compact />
      </View>

      <View style={styles.chatCard}>
        <View style={styles.messages}>
          {messages.map((message) => (
            <View key={message.id} style={[styles.messageRow, message.role === 'user' && styles.messageRowUser]}>
              {message.role === 'assistant' && <View style={styles.botAvatar}><Text style={styles.botAvatarText}>✦</Text></View>}
              <View style={[styles.bubble, message.role === 'user' ? styles.userBubble : styles.botBubble]}>
                <Text style={[styles.messageText, message.role === 'user' && styles.userMessageText]}>{message.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.prompts}>
          {prompts.map((prompt) => (
            <Pressable key={prompt} onPress={() => send(prompt)} style={({ pressed }) => [styles.promptChip, pressed && styles.pressed]}>
              <Text style={styles.promptText}>{prompt}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            accessibilityLabel="Ask the planning assistant"
            multiline
            placeholder="Ask about courses, prerequisites, or your graduation plan…"
            placeholderTextColor="#85857F"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send(input)}
            style={styles.input}
          />
          <Pressable
            accessibilityLabel="Send message"
            disabled={!input.trim()}
            onPress={() => send(input)}
            style={({ pressed }) => [styles.sendButton, !input.trim() && styles.sendDisabled, pressed && styles.pressed]}>
            <Text style={styles.sendText}>↑</Text>
          </Pressable>
        </View>
        <Text style={styles.disclaimer}>Planning guidance is illustrative. Confirm official rules in the UNSW Handbook or with an academic adviser.</Text>
      </View>

      <View style={sharedStyles.section}>
        <View style={sharedStyles.sectionHeader}>
          <View>
            <Text style={sharedStyles.sectionTitle}>Recommendations from your plan</Text>
            <Text style={sharedStyles.sectionCaption}>Open a card to see the evidence and degree fit</Text>
          </View>
        </View>
        <View style={styles.recommendations}>
          {recommendations.map((course) => (
            <AIRecommendationCard
              key={course.code}
              course={course}
              reason={recommendationReason(course.code)}
            />
          ))}
        </View>
      </View>
    </AppShell>
  );
}

function answerFor(question: string, completedUoc: number, remainingUoc: number) {
  const lower = question.toLowerCase();
  if (lower.includes('prerequisite')) return 'Your planned courses have their listed prerequisites covered. COMP3411 is eligible because COMP2521 and MATH1081 are complete. Before enrolling, confirm the latest Handbook rules.';
  if (lower.includes('elective') || lower.includes('interest')) return 'COMP3411 fits your AI interest, while COMP6080 adds practical front-end depth after COMP1531. COMP3331 is another strong option if you want systems and networking breadth.';
  if (lower.includes('finish') || lower.includes('time') || lower.includes('graduate')) return `You have completed ${completedUoc} UOC and have ${remainingUoc} UOC remaining. At 18 UOC per term, the current sequence is plausible, but you should reserve room for all core requirements and verify course availability.`;
  if (lower.includes('next') || lower.includes('term')) return 'For the next open term, COMP3900 and COMP4920 form a balanced 12 UOC base. You could add COMP3511 for an 18 UOC load if you want a product-design elective.';
  return 'I would start by checking three things against your plan: prerequisite completion, whether each course is offered in the selected term, and whether the term stays at or below 18 UOC. Open a recommendation below for a course-specific explanation.';
}

function recommendationReason(code: string) {
  if (code === 'COMP3411') return 'Both prerequisites are complete, it matches your AI interest, and it is available in an open future term.';
  if (code === 'COMP6080') return 'It builds on COMP1531 and complements your software engineering pathway with interface implementation skills.';
  return 'It builds on COMP2521 and broadens your systems pathway before your final-year project work.';
}

const styles = StyleSheet.create({
  contextBar: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12, backgroundColor: palette.blueSoft, borderRadius: 16, padding: 15, marginTop: 12 },
  contextIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: palette.blue, alignItems: 'center', justifyContent: 'center' },
  contextIconText: { color: '#FFFFFF', fontSize: 18 },
  contextBody: { flex: 1, minWidth: 220 },
  contextTitle: { color: palette.ink, fontSize: 14, fontWeight: '800' },
  contextText: { color: palette.muted, fontSize: 11, lineHeight: 16, marginTop: 3 },
  chatCard: { backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, borderRadius: 20, marginTop: 16, overflow: 'hidden' },
  messages: { minHeight: 280, padding: 18, gap: 14 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 9, maxWidth: '86%' },
  messageRowUser: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
  botAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: palette.purple, alignItems: 'center', justifyContent: 'center' },
  botAvatarText: { color: '#FFFFFF', fontSize: 13 },
  bubble: { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 11 },
  botBubble: { backgroundColor: '#F0F0EC', borderBottomLeftRadius: 5 },
  userBubble: { backgroundColor: palette.ink, borderBottomRightRadius: 5 },
  messageText: { color: palette.ink, fontSize: 14, lineHeight: 21 },
  userMessageText: { color: '#FFFFFF' },
  prompts: { gap: 8, paddingHorizontal: 18, paddingBottom: 14 },
  promptChip: { borderRadius: 17, borderWidth: 1, borderColor: '#D7D7D0', backgroundColor: palette.card, paddingHorizontal: 12, paddingVertical: 8 },
  promptText: { color: palette.purple, fontSize: 11, fontWeight: '800' },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 9, borderTopWidth: 1, borderTopColor: palette.line, padding: 12 },
  input: { flex: 1, minHeight: 48, maxHeight: 110, color: palette.ink, backgroundColor: palette.background, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },
  sendButton: { width: 46, height: 46, borderRadius: 14, backgroundColor: palette.purple, alignItems: 'center', justifyContent: 'center' },
  sendDisabled: { opacity: 0.35 },
  sendText: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  disclaimer: { color: '#8B8B85', fontSize: 9, lineHeight: 13, textAlign: 'center', paddingHorizontal: 14, paddingBottom: 10 },
  recommendations: { gap: 11 },
  pressed: { opacity: 0.68 },
});
