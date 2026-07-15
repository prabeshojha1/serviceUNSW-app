import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppShell, PrimaryButton, SecondaryButton, StatusBadge, palette } from '@/components/plan-ui';
import { getCatalogCourse, getTermLabel, usePlan } from '@/context/plan-context';

export default function RecommendationExplanation() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const course = getCatalogCourse(code);
  const { courses, isCoursePlanned } = usePlan();
  const completed = new Set(courses.filter((item) => item.status === 'completed').map((item) => item.code));

  if (!course) {
    return (
      <AppShell title="Recommendation unavailable" eyebrow="MyPlan AI" showBack>
        <Text style={styles.body}>This recommendation no longer exists in the local course catalogue.</Text>
      </AppShell>
    );
  }

  const prereqsMet = course.prerequisites.every((prerequisite) => completed.has(prerequisite));
  const alreadyPlanned = isCoursePlanned(course.code);

  return (
    <AppShell title="Why this course fits" eyebrow="AI planning explanation" showBack>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.aiIcon}><Text style={styles.aiIconText}>✦</Text></View>
          <StatusBadge status="recommended" />
        </View>
        <Text style={styles.code}>{course.code}</Text>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.summary}>This recommendation uses your completed prerequisites, stated interests, planned term load, and the course’s available study periods.</Text>
      </View>

      <View style={styles.grid}>
        <EvidenceCard icon="✓" title="Prerequisites" tone="green">
          <Text style={styles.body}>{course.prerequisites.length === 0 ? 'No formal prerequisites are listed.' : prereqsMet ? `You have completed ${course.prerequisites.join(' and ')}.` : `Review ${course.prerequisites.filter((item) => !completed.has(item)).join(', ')} before adding this course.`}</Text>
        </EvidenceCard>
        <EvidenceCard icon="◎" title="Interest match" tone="purple">
          <Text style={styles.body}>This supports your interest in {course.interest.toLowerCase()} and adds relevant breadth to your current course mix.</Text>
        </EvidenceCard>
        <EvidenceCard icon="□" title="Term availability" tone="blue">
          <Text style={styles.body}>Currently shown in {course.terms.map(getTermLabel).join(' and ')}. MyPlan will only allow one of these terms.</Text>
        </EvidenceCard>
        <EvidenceCard icon="▦" title="Degree fit" tone="orange">
          <Text style={styles.body}>{course.uoc} UOC can contribute to your computing elective space. Confirm the exact program rule in the official Handbook.</Text>
        </EvidenceCard>
      </View>

      <View style={styles.reasoningCard}>
        <Text style={styles.reasoningEyebrow}>How the assistant reasoned</Text>
        <ReasonStep number="1" text="Read completed courses and remaining degree requirements." />
        <ReasonStep number="2" text={`Matched ${course.code} against prerequisites and your ${course.interest.toLowerCase()} interest.`} />
        <ReasonStep number="3" text="Checked that an offered term has room for another 6 UOC course." />
        <ReasonStep number="4" text="Kept the decision with you; no enrolment or plan change happens automatically." />
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label={alreadyPlanned ? 'Already in MyPlan' : 'Add to MyPlan'}
          disabled={alreadyPlanned}
          onPress={() => router.push({ pathname: '/add-course', params: { code: course.code } })}
        />
        <SecondaryButton label="View course details" onPress={() => router.push(`/course-detail/${course.code}`)} />
        <SecondaryButton label="Ask a follow-up" onPress={() => router.push('/ai-assistant')} />
      </View>

      <Text style={styles.footnote}>AI guidance can be incomplete. Course rules and offerings may change; consult the UNSW Handbook and academic advice before enrolment.</Text>
    </AppShell>
  );
}

function EvidenceCard({ icon, title, tone, children }: { icon: string; title: string; tone: 'green' | 'purple' | 'blue' | 'orange'; children: React.ReactNode }) {
  const tones = {
    green: { background: palette.greenSoft, foreground: palette.green },
    purple: { background: palette.purpleSoft, foreground: palette.purple },
    blue: { background: palette.blueSoft, foreground: palette.blue },
    orange: { background: palette.orangeSoft, foreground: palette.orange },
  };
  return (
    <View style={styles.evidenceCard}>
      <View style={[styles.evidenceIcon, { backgroundColor: tones[tone].background }]}><Text style={{ color: tones[tone].foreground, fontWeight: '900' }}>{icon}</Text></View>
      <Text style={styles.evidenceTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ReasonStep({ number, text }: { number: string; text: string }) {
  return (
    <View style={styles.reasonStep}>
      <View style={styles.reasonNumber}><Text style={styles.reasonNumberText}>{number}</Text></View>
      <Text style={styles.reasonText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: palette.ink, borderRadius: 22, padding: 22, marginTop: 14 },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  aiIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: palette.purple, alignItems: 'center', justifyContent: 'center' },
  aiIconText: { color: '#FFFFFF', fontSize: 20 },
  code: { color: palette.yellow, fontSize: 14, fontWeight: '900', letterSpacing: 0.7, marginTop: 20 },
  title: { color: '#FFFFFF', fontSize: 27, lineHeight: 34, fontWeight: '900', marginTop: 4 },
  summary: { color: '#C2C2BC', fontSize: 14, lineHeight: 21, maxWidth: 720, marginTop: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 20 },
  evidenceCard: { flexGrow: 1, flexBasis: 300, minHeight: 160, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, borderRadius: 17, padding: 17 },
  evidenceIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  evidenceTitle: { color: palette.ink, fontSize: 16, fontWeight: '800', marginTop: 11, marginBottom: 5 },
  body: { color: palette.muted, fontSize: 13, lineHeight: 20 },
  reasoningCard: { backgroundColor: '#FFFBE2', borderWidth: 1, borderColor: '#E6D665', borderRadius: 18, padding: 18, marginTop: 20 },
  reasoningEyebrow: { color: '#756500', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 },
  reasonStep: { flexDirection: 'row', alignItems: 'center', gap: 11, minHeight: 45, borderTopWidth: 1, borderTopColor: '#EAE0A1' },
  reasonNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: palette.ink, alignItems: 'center', justifyContent: 'center' },
  reasonNumberText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  reasonText: { flex: 1, color: '#4E470B', fontSize: 13, lineHeight: 19 },
  actions: { gap: 9, marginTop: 20 },
  footnote: { color: '#84847E', fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 14 },
});
