import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AIRecommendationCard } from '@/components/ai-recommendation-card';
import { AppShell, PrimaryButton, SecondaryButton, StatusBadge, palette, sharedStyles } from '@/components/plan-ui';
import { usePlan } from '@/context/plan-context';
import { catalogCourses, DEGREE_TOTAL_UOC, planTerms } from '@/data/plan';

export default function MyPlanOverview() {
  const { courses, completedUoc, plannedUoc, remainingUoc } = usePlan();
  const percent = Math.round((completedUoc / DEGREE_TOTAL_UOC) * 100);
  const currentCourses = courses.filter((course) => course.termId === '2026-t1');
  const nextTerm = planTerms.find((term) => term.id === '2026-t2')!;
  const recommendations = catalogCourses.filter((course) => ['COMP3411', 'COMP6080'].includes(course.code));

  return (
    <AppShell
      title="MyPlan"
      eyebrow="Bachelor of Computer Science"
      action={<PrimaryButton label="Open planner" onPress={() => router.push('/planner')} compact />}>
      <Text style={styles.intro}>See what you have completed, shape future terms, and get advice grounded in your degree plan.</Text>

      <View style={styles.progressCard}>
        <View style={styles.progressTop}>
          <View>
            <Text style={styles.progressKicker}>Degree progress</Text>
            <Text style={styles.progressValue}>{percent}% complete</Text>
          </View>
          <View style={styles.uocCircle}>
            <Text style={styles.uocNumber}>{completedUoc}</Text>
            <Text style={styles.uocLabel}>of {DEGREE_TOTAL_UOC} UOC</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${percent}%` }]} />
        </View>
        <View style={styles.progressStats}>
          <ProgressStat value={`${completedUoc}`} label="completed" />
          <View style={styles.statDivider} />
          <ProgressStat value={`${plannedUoc}`} label="planned" />
          <View style={styles.statDivider} />
          <ProgressStat value={`${remainingUoc}`} label="remaining" />
        </View>
      </View>

      <View style={sharedStyles.section}>
        <View style={sharedStyles.sectionHeader}>
          <View>
            <Text style={sharedStyles.sectionTitle}>Current term</Text>
            <Text style={sharedStyles.sectionCaption}>Term 1, 2026 · {currentCourses.reduce((sum, item) => sum + item.uoc, 0)} UOC</Text>
          </View>
          <SecondaryButton label="View term" onPress={() => router.push('/term/2026-t1')} compact />
        </View>
        <View style={styles.courseGrid}>
          {currentCourses.map((course) => (
            <View key={course.id} style={styles.courseCard}>
              <View style={styles.courseTop}>
                <Text style={styles.courseCode}>{course.code}</Text>
                <StatusBadge status={course.status} />
              </View>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseMeta}>{course.uoc} UOC</Text>
            </View>
          ))}
          <View style={[styles.courseCard, styles.nextTermCard]}>
            <Text style={styles.nextTermKicker}>Up next</Text>
            <Text style={styles.courseTitle}>{nextTerm.label}</Text>
            <Text style={styles.courseMeta}>{courses.filter((course) => course.termId === nextTerm.id).length} courses planned</Text>
            <Text onPress={() => router.push(`/term/${nextTerm.id}`)} style={styles.inlineLink}>Review term →</Text>
          </View>
        </View>
      </View>

      <View style={sharedStyles.section}>
        <View style={styles.aiBanner}>
          <View style={styles.aiOrb}><Text style={styles.aiOrbText}>✦</Text></View>
          <View style={styles.aiBannerContent}>
            <Text style={styles.aiBannerKicker}>Planning assistant</Text>
            <Text style={styles.aiBannerTitle}>Is my plan on track?</Text>
            <Text style={styles.aiBannerBody}>I can check prerequisites, term availability, workload balance, and your remaining UOC.</Text>
          </View>
          <PrimaryButton label="Ask AI" onPress={() => router.push('/ai-assistant')} compact />
        </View>
      </View>

      <View style={sharedStyles.section}>
        <View style={sharedStyles.sectionHeader}>
          <View>
            <Text style={sharedStyles.sectionTitle}>Recommended for your plan</Text>
            <Text style={sharedStyles.sectionCaption}>Based on completed courses and your interests</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendations}>
          {recommendations.map((course) => (
            <AIRecommendationCard
              key={course.code}
              course={course}
              compact
              reason={course.code === 'COMP3411'
                ? 'You have completed COMP2521 and MATH1081, and marked AI as an interest.'
                : 'This builds on COMP1531 and adds a practical interface elective to your plan.'}
            />
          ))}
        </ScrollView>
      </View>

      <View style={sharedStyles.section}>
        <View style={styles.requirementCard}>
          <Text style={styles.requirementTitle}>Degree requirement check</Text>
          <RequirementRow label="Computer Science core" value="8 of 12 courses" tone="progress" />
          <RequirementRow label="Computing electives" value="3 of 5 courses" tone="progress" />
          <RequirementRow label="General education" value="Complete" tone="done" />
          <RequirementRow label="Free electives" value="12 UOC remaining" tone="attention" />
        </View>
      </View>
    </AppShell>
  );
}

function ProgressStat({ value, label }: { value: string; label: string }) {
  return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>UOC {label}</Text></View>;
}

function RequirementRow({ label, value, tone }: { label: string; value: string; tone: 'done' | 'progress' | 'attention' }) {
  const colors = tone === 'done'
    ? { bg: palette.greenSoft, text: palette.green }
    : tone === 'attention'
      ? { bg: palette.orangeSoft, text: palette.orange }
      : { bg: palette.blueSoft, text: palette.blue };
  return (
    <View style={styles.requirementRow}>
      <View style={[styles.requirementIcon, { backgroundColor: colors.bg }]}><Text style={{ color: colors.text }}>{tone === 'done' ? '✓' : '•'}</Text></View>
      <Text style={styles.requirementLabel}>{label}</Text>
      <Text style={[styles.requirementValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { color: palette.muted, fontSize: 15, lineHeight: 22, maxWidth: 680, marginTop: 5 },
  progressCard: { marginTop: 22, backgroundColor: palette.ink, borderRadius: 22, padding: 22 },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 18 },
  progressKicker: { color: '#BEBEB8', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  progressValue: { color: '#FFFFFF', fontSize: 28, lineHeight: 35, fontWeight: '800', marginTop: 4 },
  uocCircle: { width: 82, height: 82, borderRadius: 41, borderWidth: 7, borderColor: palette.yellow, alignItems: 'center', justifyContent: 'center' },
  uocNumber: { color: '#FFFFFF', fontSize: 22, lineHeight: 25, fontWeight: '900' },
  uocLabel: { color: '#BEBEB8', fontSize: 9, lineHeight: 12 },
  progressTrack: { height: 9, borderRadius: 5, backgroundColor: '#3A3A38', overflow: 'hidden', marginTop: 22 },
  progressFill: { height: '100%', borderRadius: 5, backgroundColor: palette.yellow },
  progressStats: { flexDirection: 'row', marginTop: 18, alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  statLabel: { color: '#AFAFAA', fontSize: 10, marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: '#3E3E3B' },
  courseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  courseCard: { flexGrow: 1, flexBasis: 230, minHeight: 142, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, borderRadius: 17, padding: 16 },
  courseTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  courseCode: { color: palette.blue, fontSize: 14, fontWeight: '900' },
  courseTitle: { color: palette.ink, fontSize: 17, lineHeight: 22, fontWeight: '800', marginTop: 12 },
  courseMeta: { color: palette.muted, fontSize: 12, lineHeight: 17, marginTop: 7 },
  nextTermCard: { backgroundColor: '#FFFBE1', borderColor: '#E7D55F' },
  nextTermKicker: { color: '#766600', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.7 },
  inlineLink: { color: palette.blue, fontSize: 13, fontWeight: '800', marginTop: 10 },
  aiBanner: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 16, backgroundColor: '#F1EAF9', borderWidth: 1, borderColor: '#DDD0EE', borderRadius: 20, padding: 20 },
  aiOrb: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.purple },
  aiOrbText: { color: '#FFFFFF', fontSize: 23 },
  aiBannerContent: { flex: 1, minWidth: 220 },
  aiBannerKicker: { color: palette.purple, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.7 },
  aiBannerTitle: { color: palette.ink, fontSize: 20, lineHeight: 25, fontWeight: '800', marginTop: 3 },
  aiBannerBody: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 4 },
  recommendations: { gap: 12, paddingBottom: 2 },
  requirementCard: { backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, borderRadius: 18, padding: 18 },
  requirementTitle: { color: palette.ink, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  requirementRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 11, borderTopWidth: 1, borderTopColor: '#EEEEEA' },
  requirementIcon: { width: 25, height: 25, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  requirementLabel: { flex: 1, color: palette.ink, fontSize: 14, fontWeight: '600' },
  requirementValue: { fontSize: 12, fontWeight: '800' },
});
