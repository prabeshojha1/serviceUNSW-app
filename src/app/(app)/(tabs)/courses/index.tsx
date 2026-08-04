import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from '@/components/ui/native';

import { CourseListCard } from '@/components/course/course-list-card';
import {
  AppScreen,
  Button,
  ChoiceRow,
  EmptyState,
  InlineNotice,
  Metric,
  ModalSheet,
  SearchField,
  SectionHeader,
} from '@/components/ui/app-ui';
import { CourseFilters, useCourseLibrary } from '@/context/course-context';
import { usePlan } from '@/context/plan-context';
import { catalogCourses, DEGREE_TOTAL_UOC, planTerms } from '@/data/plan';
import { colors } from '@/theme/tokens';
import { CatalogCourse } from '@/types/plan';

export default function CoursesScreen() {
  const params = useLocalSearchParams<{ filters?: string }>();
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(params.filters === '1');
  const {
    compareCodes,
    filters,
    resetFilters,
    savedCodes,
    setFilters,
    toggleCompare,
    toggleSaved,
  } = useCourseLibrary();
  const { completedUoc, isCoursePlanned } = usePlan();

  const filteredCourses = useMemo(
    () =>
      catalogCourses.filter((course) => {
        const query = search.trim().toLowerCase();
        const matchesQuery =
          !query ||
          course.code.toLowerCase().includes(query) ||
          course.title.toLowerCase().includes(query) ||
          course.interest.toLowerCase().includes(query);
        const courseLevel = Number(course.code.match(/\d/)?.[0] ?? 0);
        const matchesTerm = filters.term === 'all' || course.terms.includes(filters.term);
        const matchesLevel =
          filters.level === 'all' ||
          (filters.level === '4+' ? courseLevel >= 4 : courseLevel === Number(filters.level));
        const matchesPrerequisites =
          filters.prerequisites === 'all' ||
          (filters.prerequisites === 'required'
            ? course.prerequisites.length > 0
            : course.prerequisites.length === 0);
        return matchesQuery && matchesTerm && matchesLevel && matchesPrerequisites;
      }),
    [filters, search],
  );

  const activeFilterCount = Object.values(filters).filter((value) => value !== 'all').length;
  const planPercent = Math.round((completedUoc / DEGREE_TOTAL_UOC) * 100);

  return (
    <AppScreen
      subtitle="Discover courses and connect them to your degree plan"
      title="Courses">
      <View className="gap-8">
        <InlineNotice
          action={
            <Button
              icon="map-outline"
              label="Open MyPlan"
              onPress={() => router.push('/my-plan')}
              size="sm"
            />
          }
          description={`${planPercent}% complete · See how a course fits before adding it to a term.`}
          icon="school-outline"
          title="Your degree plan is connected"
          tone="brand"
        />

        <View className="gap-3 xl:flex-row">
          <ToolCard
            count={savedCodes.length}
            icon="bookmark-outline"
            label="Saved courses"
            onPress={() => router.push('/courses/saved')}
          />
          <ToolCard
            count={compareCodes.length}
            icon="git-compare-outline"
            label="Compare courses"
            onPress={() => router.push('/courses/compare')}
          />
          <ToolCard
            icon="sparkles-outline"
            label="Ask about courses"
            onPress={() =>
              router.push({ pathname: '/my-plan', params: { assistant: '1' } })
            }
            tone="ai"
          />
        </View>

        <View>
          <SectionHeader
            description="Search by course code, title, or interest area."
            title="Course catalogue"
          />
          <View className="gap-3 md:flex-row">
            <View className="min-w-0 flex-1">
              <SearchField
                onChangeText={setSearch}
                placeholder="Search courses"
                value={search}
              />
            </View>
            <Button
              icon="options-outline"
              label={activeFilterCount ? `Filters (${activeFilterCount})` : 'Filters'}
              onPress={() => setFiltersOpen(true)}
              variant={activeFilterCount ? 'primary' : 'secondary'}
            />
          </View>
        </View>

        <View>
          <SectionHeader
            description={`${filteredCourses.length} ${
              filteredCourses.length === 1 ? 'course' : 'courses'
            } found`}
            title={search ? `Results for “${search}”` : 'Recommended and popular'}
          />
          <View className="gap-3">
            {filteredCourses.length ? (
              filteredCourses.map((course) => (
                <CourseListCard
                  compared={compareCodes.includes(course.code)}
                  course={course}
                  key={course.code}
                  onOpen={() => router.push(`/courses/${course.code}`)}
                  onToggleCompare={() => toggleCompare(course.code)}
                  onToggleSaved={() => toggleSaved(course.code)}
                  planned={isCoursePlanned(course.code)}
                  saved={savedCodes.includes(course.code)}
                />
              ))
            ) : (
              <EmptyState
                action={
                  <Button
                    label="Clear filters"
                    onPress={() => {
                      setSearch('');
                      resetFilters();
                    }}
                    variant="secondary"
                  />
                }
                description="Try a broader search or remove one of the active filters."
                icon="search-outline"
                title="No matching courses"
              />
            )}
          </View>
        </View>
      </View>

      <CourseFilterSheet
        filters={filters}
        onChange={setFilters}
        onClose={() => setFiltersOpen(false)}
        onReset={resetFilters}
        visible={filtersOpen}
      />
    </AppScreen>
  );
}

function ToolCard({
  icon,
  label,
  count,
  onPress,
  tone = 'neutral',
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  count?: number;
  onPress: () => void;
  tone?: 'neutral' | 'ai';
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`min-h-24 min-w-0 flex-1 flex-row items-center gap-3 rounded-card border p-4 ${
        tone === 'ai' ? 'border-ai/20 bg-ai-soft' : 'border-border bg-surface'
      } active:opacity-70`}>
      <View
        className={`h-11 w-11 items-center justify-center rounded-xl ${
          tone === 'ai' ? 'bg-ai' : 'bg-surface-muted'
        }`}>
        <Ionicons color={tone === 'ai' ? colors.white : colors.ink} name={icon} size={22} />
      </View>
      <View className="min-w-0 flex-1">
        {typeof count === 'number' ? <Metric label={label} value={count} /> : (
          <>
            <Text className="text-base font-extrabold text-ink">{label}</Text>
            <Text className="mt-1 text-xs text-muted">Context-aware planning help</Text>
          </>
        )}
      </View>
      <Ionicons color={colors.muted} name="chevron-forward" size={18} />
    </Pressable>
  );
}

function CourseFilterSheet({
  visible,
  filters,
  onChange,
  onReset,
  onClose,
}: {
  visible: boolean;
  filters: CourseFilters;
  onChange: (filters: CourseFilters) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const set = <K extends keyof CourseFilters>(key: K, value: CourseFilters[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <ModalSheet
      description="Filters update the catalogue immediately."
      footer={
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button fullWidth label="Reset" onPress={onReset} variant="secondary" />
          </View>
          <View className="flex-1">
            <Button fullWidth label="Show results" onPress={onClose} />
          </View>
        </View>
      }
      onClose={onClose}
      title="Course filters"
      visible={visible}>
      <FilterGroup label="Term offered">
        <ChoiceRow
          label="Any term"
          onPress={() => set('term', 'all')}
          selected={filters.term === 'all'}
        />
        {planTerms
          .filter((term) => term.id !== 'completed')
          .slice(0, 3)
          .map((term) => (
            <ChoiceRow
              key={term.id}
              label={term.label}
              onPress={() => set('term', term.id)}
              selected={filters.term === term.id}
            />
          ))}
      </FilterGroup>

      <FilterGroup label="Course level">
        {(['all', '1', '2', '3', '4+'] as CourseFilters['level'][]).map((level) => (
          <ChoiceRow
            key={level}
            label={level === 'all' ? 'Any level' : `Level ${level}`}
            onPress={() => set('level', level)}
            selected={filters.level === level}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Prerequisites">
        <ChoiceRow
          label="Any"
          onPress={() => set('prerequisites', 'all')}
          selected={filters.prerequisites === 'all'}
        />
        <ChoiceRow
          label="No prerequisites"
          onPress={() => set('prerequisites', 'none')}
          selected={filters.prerequisites === 'none'}
        />
        <ChoiceRow
          label="Has prerequisites"
          onPress={() => set('prerequisites', 'required')}
          selected={filters.prerequisites === 'required'}
        />
      </FilterGroup>
    </ModalSheet>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="mb-1 text-sm font-extrabold text-ink">{label}</Text>
      {children}
    </View>
  );
}

export function courseLevel(course: CatalogCourse) {
  return Number(course.code.match(/\d/)?.[0] ?? 0);
}
