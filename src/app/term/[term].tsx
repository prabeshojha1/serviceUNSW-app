import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppShell, PrimaryButton, SecondaryButton, StatusBadge, palette, sharedStyles } from '@/components/plan-ui';
import { usePlan } from '@/context/plan-context';
import { planTerms } from '@/data/plan';
import { PlanTermId } from '@/types/plan';

export default function TermScreen() {
  const { term } = useLocalSearchParams<{ term: PlanTermId }>();
  const { courses, removeCourse } = usePlan();
  const termInfo = planTerms.find((item) => item.id === term) ?? planTerms[1];
  const termCourses = courses.filter((course) => course.termId === termInfo.id);
  const uoc = termCourses.reduce((sum, course) => sum + course.uoc, 0);
  const isHistory = termInfo.id === 'completed';

  return (
    <AppShell
      title={termInfo.label}
      eyebrow={isHistory ? 'MyPlan · Academic history' : `MyPlan · ${termInfo.year}`}
      showBack
      action={!isHistory ? <PrimaryButton label="+ Add course" onPress={() => router.push({ pathname: '/add-course', params: { term: termInfo.id } })} compact /> : undefined}>
      <View style={styles.summary}>
        <Summary value={`${termCourses.length}`} label="courses" />
        <View style={styles.divider} />
        <Summary value={`${uoc}`} label={isHistory ? 'UOC completed' : `of ${termInfo.capacity} UOC`} />
        <View style={styles.divider} />
        <Summary value={isHistory ? 'Passed' : uoc >= 18 ? 'Full load' : 'Flexible'} label={isHistory ? 'result' : 'study load'} />
      </View>

      <View style={sharedStyles.section}>
        <View style={styles.courseList}>
          {termCourses.map((course, index) => (
            <View key={course.id} style={styles.courseRow}>
              <View style={styles.courseIndex}><Text style={styles.courseIndexText}>{index + 1}</Text></View>
              <View style={styles.courseBody}>
                <View style={styles.courseTop}>
                  <Text style={styles.courseCode}>{course.code}</Text>
                  <StatusBadge status={course.status} />
                </View>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseMeta}>{course.uoc} UOC{course.prerequisites?.length ? ` · Prerequisites: ${course.prerequisites.join(', ')}` : ''}</Text>
              </View>
              <View style={styles.actions}>
                <SecondaryButton label="Details" onPress={() => router.push(`/course-detail/${course.code}`)} compact />
                {!isHistory && <Text onPress={() => removeCourse(course.id)} style={styles.remove}>Remove</Text>}
              </View>
            </View>
          ))}
        </View>
      </View>

      {!isHistory && (
        <View style={styles.advice}>
          <Text style={styles.adviceIcon}>✦</Text>
          <View style={styles.adviceBody}>
            <Text style={styles.adviceTitle}>{uoc > 18 ? 'This term may be overloaded' : 'Your workload looks balanced'}</Text>
            <Text style={styles.adviceText}>{uoc > 18 ? 'Consider moving one course to another term.' : 'The assistant can also check course sequencing and prerequisite timing.'}</Text>
          </View>
          <SecondaryButton label="Check with AI" onPress={() => router.push('/ai-assistant')} compact />
        </View>
      )}
    </AppShell>
  );
}

function Summary({ value, label }: { value: string; label: string }) {
  return <View style={styles.summaryItem}><Text style={styles.summaryValue}>{value}</Text><Text style={styles.summaryLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', alignItems: 'center', backgroundColor: palette.ink, borderRadius: 19, paddingVertical: 18, marginTop: 14 },
  summaryItem: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  summaryValue: { color: '#FFFFFF', fontSize: 18, lineHeight: 23, fontWeight: '900', textAlign: 'center' },
  summaryLabel: { color: '#B8B8B2', fontSize: 10, lineHeight: 14, marginTop: 3, textAlign: 'center' },
  divider: { width: 1, height: 34, backgroundColor: '#444440' },
  courseList: { gap: 10 },
  courseRow: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, borderRadius: 16, padding: 15 },
  courseIndex: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#F0F0EB', alignItems: 'center', justifyContent: 'center' },
  courseIndexText: { color: palette.muted, fontSize: 13, fontWeight: '800' },
  courseBody: { flex: 1, minWidth: 150 },
  courseTop: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  courseCode: { color: palette.blue, fontSize: 13, fontWeight: '900' },
  courseTitle: { color: palette.ink, fontSize: 16, lineHeight: 21, fontWeight: '800', marginTop: 5 },
  courseMeta: { color: palette.muted, fontSize: 11, lineHeight: 16, marginTop: 5 },
  actions: { alignItems: 'center', gap: 5 },
  remove: { color: palette.red, fontSize: 11, fontWeight: '700', padding: 5 },
  advice: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 13, backgroundColor: palette.purpleSoft, borderRadius: 17, padding: 17, marginTop: 22 },
  adviceIcon: { color: palette.purple, fontSize: 22 },
  adviceBody: { flex: 1, minWidth: 210 },
  adviceTitle: { color: palette.ink, fontSize: 15, fontWeight: '800' },
  adviceText: { color: palette.muted, fontSize: 12, lineHeight: 17, marginTop: 3 },
});
