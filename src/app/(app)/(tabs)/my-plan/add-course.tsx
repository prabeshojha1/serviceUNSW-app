import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from '@/components/ui/native';

import {
  AppScreen,
  Badge,
  Button,
  Card,
  ChoiceRow,
  EmptyState,
  SearchField,
  SectionHeader,
} from '@/components/ui/app-ui';
import { usePlan } from '@/context/plan-context';
import { catalogCourses, planTerms } from '@/data/plan';
import { PlanTermId } from '@/types/plan';

export default function AddCourseScreen() {
  const params = useLocalSearchParams<{ course?: string; term?: string }>();
  const initialCourse = catalogCourses.some((course) => course.code === params.course)
    ? params.course
    : undefined;
  const initialTerm = planTerms.some((term) => term.id === params.term)
    ? (params.term as PlanTermId)
    : undefined;
  const [search, setSearch] = useState(initialCourse ?? '');
  const [selectedCode, setSelectedCode] = useState<string | undefined>(initialCourse);
  const [selectedTerm, setSelectedTerm] = useState<PlanTermId | undefined>(initialTerm);
  const [added, setAdded] = useState(false);
  const { addCourse, isCoursePlanned } = usePlan();
  const selectedCourse = catalogCourses.find((course) => course.code === selectedCode);

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return catalogCourses.slice(0, 6);
    return catalogCourses
      .filter(
        (course) =>
          course.code.toLowerCase().includes(query) ||
          course.title.toLowerCase().includes(query) ||
          course.interest.toLowerCase().includes(query),
      )
      .slice(0, 8);
  }, [search]);

  if (added && selectedCourse && selectedTerm) {
    const term = planTerms.find((item) => item.id === selectedTerm);
    return (
      <AppScreen back subtitle="MyPlan" title="Course added">
        <View className="mx-auto w-full max-w-xl">
          <EmptyState
            action={
              <View className="w-full gap-3">
                <Button
                  fullWidth
                  label={`View ${term?.shortLabel ?? 'term'}`}
                  onPress={() => router.replace(`/my-plan/term/${selectedTerm}`)}
                />
                <Button
                  fullWidth
                  label="Back to planner"
                  onPress={() => router.replace('/my-plan/planner')}
                  variant="secondary"
                />
              </View>
            }
            description={`${selectedCourse.code} has been added to ${term?.label}.`}
            icon="checkmark-circle-outline"
            title={selectedCourse.title}
          />
        </View>
      </AppScreen>
    );
  }

  const offeredTerms = selectedCourse
    ? planTerms.filter((term) => selectedCourse.terms.includes(term.id))
    : [];
  const alreadyPlanned = selectedCourse ? isCoursePlanned(selectedCourse.code) : false;

  return (
    <AppScreen back subtitle="MyPlan" title="Add a course">
      <View className="gap-8 xl:flex-row xl:items-start">
        <View className="min-w-0 flex-[1.2]">
          <SectionHeader
            description="Search the catalogue, then choose a study period."
            title="Choose course"
          />
          <SearchField onChangeText={setSearch} placeholder="Course code or title" value={search} />
          <View className="mt-3 gap-2">
            {results.map((course) => (
              <ChoiceRow
                description={`${course.uoc} UOC · ${course.interest}${
                  isCoursePlanned(course.code) ? ' · Already in MyPlan' : ''
                }`}
                key={course.code}
                label={`${course.code} · ${course.title}`}
                onPress={() => {
                  setSelectedCode(course.code);
                  setSelectedTerm(undefined);
                }}
                selected={selectedCode === course.code}
              />
            ))}
          </View>
        </View>

        <View className="min-w-0 flex-1">
          <SectionHeader
            description={
              selectedCourse
                ? 'Only study periods in which this course is offered are shown.'
                : 'Select a course first.'
            }
            title="Choose study period"
          />
          <Card>
            {selectedCourse ? (
              <>
                <View className="flex-row flex-wrap items-center gap-2">
                  <Badge label={selectedCourse.code} tone="info" />
                  <Badge label={`${selectedCourse.uoc} UOC`} />
                </View>
                <Text className="mt-3 text-xl font-black text-ink">{selectedCourse.title}</Text>
                <View className="mt-4 gap-2 border-t border-border pt-4">
                  {offeredTerms.map((term) => (
                    <ChoiceRow
                      key={term.id}
                      label={term.label}
                      onPress={() => setSelectedTerm(term.id)}
                      selected={selectedTerm === term.id}
                    />
                  ))}
                </View>
                {alreadyPlanned ? (
                  <Text className="mt-4 text-sm font-semibold text-warning">
                    This course is already in your plan.
                  </Text>
                ) : null}
                <View className="mt-5">
                  <Button
                    disabled={!selectedTerm || alreadyPlanned}
                    fullWidth
                    icon="add"
                    label="Add to MyPlan"
                    onPress={() => {
                      if (!selectedTerm) return;
                      addCourse(selectedCourse, selectedTerm);
                      setAdded(true);
                    }}
                  />
                </View>
              </>
            ) : (
              <Text className="py-8 text-center text-sm text-muted">
                Select a course to see available study periods.
              </Text>
            )}
          </Card>
        </View>
      </View>
    </AppScreen>
  );
}
