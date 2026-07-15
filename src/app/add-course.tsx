import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppShell, PrimaryButton, SecondaryButton, palette } from '@/components/plan-ui';
import { getCatalogCourse, getTermLabel, usePlan } from '@/context/plan-context';
import { catalogCourses, planTerms } from '@/data/plan';
import { CatalogCourse, PlanTermId } from '@/types/plan';

type Step = 'course' | 'term' | 'success';

export default function AddCourseScreen() {
  const params = useLocalSearchParams<{ term?: PlanTermId; code?: string }>();
  const presetCourse = params.code ? getCatalogCourse(params.code) : undefined;
  const [step, setStep] = useState<Step>(presetCourse ? 'term' : 'course');
  const [query, setQuery] = useState(presetCourse?.code ?? '');
  const [selectedCourse, setSelectedCourse] = useState<CatalogCourse | null>(presetCourse ?? null);
  const [selectedTerm, setSelectedTerm] = useState<PlanTermId | null>(params.term ?? null);
  const { addCourse, courses, isCoursePlanned } = usePlan();
  const completedCodes = useMemo(() => new Set(courses.filter((course) => course.status === 'completed').map((course) => course.code)), [courses]);
  const filtered = catalogCourses.filter((course) => `${course.code} ${course.title} ${course.interest}`.toLowerCase().includes(query.trim().toLowerCase()));

  const chooseCourse = (course: CatalogCourse) => {
    setSelectedCourse(course);
    if (params.term && course.terms.includes(params.term)) {
      setSelectedTerm(params.term);
    } else {
      setSelectedTerm(null);
    }
    setStep('term');
  };

  const confirm = () => {
    if (!selectedCourse || !selectedTerm) return;
    addCourse(selectedCourse, selectedTerm);
    setStep('success');
  };

  if (step === 'success' && selectedCourse && selectedTerm) {
    return (
      <AppShell title="Course added" eyebrow="MyPlan" showBack>
        <View style={styles.successCard}>
          <View style={styles.successIcon}><Text style={styles.successIconText}>✓</Text></View>
          <Text style={styles.successTitle}>{selectedCourse.code} is now in {getTermLabel(selectedTerm)}</Text>
          <Text style={styles.successBody}>{selectedCourse.title} has been added as a planned course. Your degree progress and term load are updated.</Text>
          <View style={styles.successSummary}>
            <Summary label="Course" value={selectedCourse.code} />
            <Summary label="Study period" value={getTermLabel(selectedTerm)} />
            <Summary label="Credit" value={`${selectedCourse.uoc} UOC`} />
          </View>
          <View style={styles.successActions}>
            <PrimaryButton label="View term" onPress={() => router.replace(`/term/${selectedTerm}`)} />
            <SecondaryButton label="Back to planner" onPress={() => router.replace('/planner')} />
          </View>
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell title="Add a course" eyebrow="MyPlan" showBack>
      <View style={styles.steps}>
        <StepBadge number="1" label="Choose course" active={step === 'course'} done={step === 'term'} />
        <View style={styles.stepLine} />
        <StepBadge number="2" label="Choose term" active={step === 'term'} done={false} />
      </View>

      {step === 'course' ? (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Find a course</Text>
          <Text style={styles.panelBody}>Search the course catalogue by code, title, or interest area.</Text>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              accessibilityLabel="Search courses"
              autoCapitalize="characters"
              placeholder="Try COMP3411 or artificial intelligence"
              placeholderTextColor="#8A8A84"
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
            />
            {!!query && <Text onPress={() => setQuery('')} style={styles.clear}>Clear</Text>}
          </View>
          <View style={styles.results}>
            {filtered.map((course) => {
              const planned = isCoursePlanned(course.code);
              const met = course.prerequisites.every((code) => completedCodes.has(code));
              return (
                <Pressable
                  key={course.code}
                  disabled={planned}
                  onPress={() => chooseCourse(course)}
                  style={({ pressed }) => [styles.resultCard, planned && styles.resultDisabled, pressed && styles.pressed]}>
                  <View style={styles.resultTop}>
                    <View style={styles.resultCodeBlock}>
                      <Text style={styles.resultCode}>{course.code}</Text>
                      <Text style={styles.resultUoc}>{course.uoc} UOC</Text>
                    </View>
                    <View style={styles.resultBody}>
                      <Text style={styles.resultTitle}>{course.title}</Text>
                      <Text style={styles.resultMeta}>{course.interest} · Offered {course.terms.map(getTermLabel).join(', ')}</Text>
                      <Text style={[styles.prereq, { color: met ? palette.green : palette.red }]}>{course.prerequisites.length === 0 ? 'No prerequisites' : met ? '✓ Prerequisites completed' : `Check: ${course.prerequisites.join(', ')}`}</Text>
                    </View>
                    <Text style={styles.resultAction}>{planned ? 'In plan' : 'Select →'}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : selectedCourse ? (
        <View style={styles.panel}>
          <Pressable onPress={() => setStep('course')} style={styles.selectedCourse}>
            <View>
              <Text style={styles.selectedLabel}>Selected course</Text>
              <Text style={styles.selectedTitle}>{selectedCourse.code} · {selectedCourse.title}</Text>
            </View>
            <Text style={styles.change}>Change</Text>
          </Pressable>
          <Text style={styles.panelTitle}>Choose a study period</Text>
          <Text style={styles.panelBody}>Only terms in which this course is offered can be selected.</Text>
          <View style={styles.termGrid}>
            {planTerms.filter((term) => term.id !== 'completed').map((term) => {
              const offered = selectedCourse.terms.includes(term.id);
              const active = selectedTerm === term.id;
              const load = courses.filter((course) => course.termId === term.id).reduce((sum, course) => sum + course.uoc, 0);
              return (
                <Pressable
                  key={term.id}
                  disabled={!offered}
                  onPress={() => setSelectedTerm(term.id)}
                  style={({ pressed }) => [styles.termCard, active && styles.termCardActive, !offered && styles.termCardDisabled, pressed && styles.pressed]}>
                  <View style={styles.radioOuter}>{active && <View style={styles.radioInner} />}</View>
                  <View style={styles.termBody}>
                    <Text style={styles.termTitle}>{term.label}</Text>
                    <Text style={styles.termMeta}>{offered ? `${load}/${term.capacity} UOC currently planned` : 'Not offered this term'}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.confirmRow}>
            <SecondaryButton label="Back" onPress={() => setStep('course')} />
            <PrimaryButton label="Add to plan" onPress={confirm} disabled={!selectedTerm} />
          </View>
        </View>
      ) : null}
    </AppShell>
  );
}

function StepBadge({ number, label, active, done }: { number: string; label: string; active: boolean; done: boolean }) {
  return (
    <View style={styles.step}>
      <View style={[styles.stepNumber, active && styles.stepNumberActive, done && styles.stepNumberDone]}><Text style={[styles.stepNumberText, (active || done) && styles.stepNumberTextActive]}>{done ? '✓' : number}</Text></View>
      <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
    </View>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return <View style={styles.summaryItem}><Text style={styles.summaryLabel}>{label}</Text><Text style={styles.summaryValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  steps: { flexDirection: 'row', alignItems: 'center', maxWidth: 520, marginTop: 16, marginBottom: 22 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E1E1DC', alignItems: 'center', justifyContent: 'center' },
  stepNumberActive: { backgroundColor: palette.ink },
  stepNumberDone: { backgroundColor: palette.green },
  stepNumberText: { color: palette.muted, fontSize: 12, fontWeight: '900' },
  stepNumberTextActive: { color: '#FFFFFF' },
  stepLabel: { color: palette.muted, fontSize: 12, fontWeight: '700' },
  stepLabelActive: { color: palette.ink },
  stepLine: { flex: 1, height: 1, backgroundColor: '#D5D5CF', marginHorizontal: 12 },
  panel: { backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, borderRadius: 20, padding: 20 },
  panelTitle: { color: palette.ink, fontSize: 21, lineHeight: 27, fontWeight: '800' },
  panelBody: { color: palette.muted, fontSize: 14, lineHeight: 20, marginTop: 4 },
  searchBar: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: palette.background, borderWidth: 1, borderColor: '#D4D4CE', borderRadius: 14, paddingHorizontal: 14, marginTop: 18 },
  searchIcon: { color: palette.muted, fontSize: 21 },
  searchInput: { flex: 1, color: palette.ink, fontSize: 15, paddingVertical: 12 },
  clear: { color: palette.blue, fontSize: 12, fontWeight: '800', padding: 6 },
  results: { gap: 9, marginTop: 16 },
  resultCard: { borderWidth: 1, borderColor: palette.line, borderRadius: 14, padding: 14 },
  resultDisabled: { opacity: 0.48, backgroundColor: '#F3F3EF' },
  resultTop: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  resultCodeBlock: { width: 72 },
  resultCode: { color: palette.blue, fontSize: 13, fontWeight: '900' },
  resultUoc: { color: palette.muted, fontSize: 10, marginTop: 3 },
  resultBody: { flex: 1 },
  resultTitle: { color: palette.ink, fontSize: 15, lineHeight: 20, fontWeight: '800' },
  resultMeta: { color: palette.muted, fontSize: 11, lineHeight: 16, marginTop: 3 },
  prereq: { fontSize: 11, fontWeight: '700', marginTop: 5 },
  resultAction: { color: palette.blue, fontSize: 11, fontWeight: '900' },
  selectedCourse: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, backgroundColor: palette.blueSoft, borderRadius: 13, padding: 14, marginBottom: 22 },
  selectedLabel: { color: palette.blue, fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.6 },
  selectedTitle: { color: palette.ink, fontSize: 14, lineHeight: 19, fontWeight: '800', marginTop: 3 },
  change: { color: palette.blue, fontSize: 12, fontWeight: '800' },
  termGrid: { gap: 9, marginTop: 16 },
  termCard: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: palette.line, borderRadius: 14, padding: 14 },
  termCardActive: { borderColor: palette.blue, backgroundColor: palette.blueSoft },
  termCardDisabled: { opacity: 0.43, backgroundColor: '#F1F1ED' },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: palette.blue, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: palette.blue },
  termBody: { flex: 1 },
  termTitle: { color: palette.ink, fontSize: 14, fontWeight: '800' },
  termMeta: { color: palette.muted, fontSize: 11, marginTop: 4 },
  confirmRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 20 },
  successCard: { maxWidth: 660, alignSelf: 'center', width: '100%', alignItems: 'center', backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, borderRadius: 22, padding: 26, marginTop: 18 },
  successIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: palette.greenSoft, alignItems: 'center', justifyContent: 'center' },
  successIconText: { color: palette.green, fontSize: 30, fontWeight: '900' },
  successTitle: { color: palette.ink, fontSize: 24, lineHeight: 31, fontWeight: '900', textAlign: 'center', marginTop: 18 },
  successBody: { color: palette.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', maxWidth: 500, marginTop: 8 },
  successSummary: { alignSelf: 'stretch', flexDirection: 'row', backgroundColor: palette.background, borderRadius: 15, padding: 15, marginTop: 22 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { color: palette.muted, fontSize: 10, fontWeight: '700' },
  summaryValue: { color: palette.ink, fontSize: 13, fontWeight: '900', marginTop: 4, textAlign: 'center' },
  successActions: { alignSelf: 'stretch', gap: 10, marginTop: 22 },
  pressed: { opacity: 0.65 },
});
