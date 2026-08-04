import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

import {
  catalogCourses,
  defaultPlanningPreferences,
  DEGREE_TOTAL_UOC,
  degreeRequirements,
  initialPlanCourses,
  planTerms,
} from '@/data/plan';
import {
  CatalogCourse,
  DegreeRequirementProgress,
  PlanCourse,
  PlanningPreferences,
  PlanRecommendation,
  PlanTermId,
} from '@/types/plan';

interface PlanContextValue {
  courses: PlanCourse[];
  recommendations: PlanRecommendation[];
  requirements: DegreeRequirementProgress[];
  preferences: PlanningPreferences;
  completedUoc: number;
  plannedUoc: number;
  remainingUoc: number;
  unallocatedUoc: number;
  addCourse: (course: CatalogCourse, termId: PlanTermId) => void;
  acceptRecommendation: (courseCode: string) => void;
  rejectRecommendation: (courseCode: string) => void;
  updatePreferences: (preferences: PlanningPreferences) => void;
  moveCourse: (courseId: string, termId: PlanTermId) => void;
  removeCourse: (courseId: string) => void;
  isCoursePlanned: (code: string) => boolean;
}

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: PropsWithChildren) {
  const [courses, setCourses] = useState(initialPlanCourses);
  const [preferences, setPreferences] = useState(defaultPlanningPreferences);
  const [dismissedRecommendationCodes, setDismissedRecommendationCodes] = useState<string[]>([]);

  const recommendations = useMemo(
    () => buildRecommendations(courses, preferences, dismissedRecommendationCodes),
    [courses, dismissedRecommendationCodes, preferences],
  );

  const value = useMemo<PlanContextValue>(() => {
    const completedUoc = courses
      .filter((course) => course.status === 'completed')
      .reduce((sum, course) => sum + course.uoc, 0);
    const plannedUoc = courses
      .filter((course) => course.status === 'planned' || course.status === 'in-progress')
      .reduce((sum, course) => sum + course.uoc, 0);
    const requirements = degreeRequirements.map<DegreeRequirementProgress>((requirement) => {
      const matchingCourses = courses.filter((course) => course.requirementId === requirement.id);
      const requirementCompletedUoc = matchingCourses
        .filter((course) => course.status === 'completed')
        .reduce((sum, course) => sum + course.uoc, 0);
      const requirementPlannedUoc = matchingCourses
        .filter((course) => course.status === 'planned' || course.status === 'in-progress')
        .reduce((sum, course) => sum + course.uoc, 0);
      return {
        ...requirement,
        completedUoc: requirementCompletedUoc,
        plannedUoc: requirementPlannedUoc,
        outstandingUoc: Math.max(
          0,
          requirement.requiredUoc - requirementCompletedUoc - requirementPlannedUoc,
        ),
      };
    });

    return {
      courses,
      recommendations,
      requirements,
      preferences,
      completedUoc,
      plannedUoc,
      remainingUoc: Math.max(0, DEGREE_TOTAL_UOC - completedUoc),
      unallocatedUoc: Math.max(0, DEGREE_TOTAL_UOC - completedUoc - plannedUoc),
      addCourse: (course, termId) => {
        setCourses((current) => {
          if (current.some((item) => item.code === course.code && item.status !== 'failed')) return current;
          return [
            ...current,
            {
              id: `${course.code}-${Date.now()}`,
              code: course.code,
              title: course.title,
              uoc: course.uoc,
              status: 'planned',
              termId,
              requirementId: course.requirementId,
              prerequisites: course.prerequisites,
              interest: course.interest,
            },
          ];
        });
      },
      acceptRecommendation: (courseCode) => {
        const recommendation = recommendations.find((item) => item.course.code === courseCode);
        if (!recommendation) return;
        setCourses((current) => {
          if (current.some((course) => course.code === courseCode && course.status !== 'failed')) {
            return current;
          }
          const { course, termId } = recommendation;
          return [
            ...current,
            {
              id: `${course.code}-${Date.now()}`,
              code: course.code,
              title: course.title,
              uoc: course.uoc,
              status: 'planned',
              termId,
              requirementId: course.requirementId,
              prerequisites: course.prerequisites,
              interest: course.interest,
            },
          ];
        });
      },
      rejectRecommendation: (courseCode) => {
        setDismissedRecommendationCodes((current) =>
          current.includes(courseCode) ? current : [...current, courseCode],
        );
      },
      updatePreferences: setPreferences,
      moveCourse: (courseId, termId) => {
        setCourses((current) =>
          current.map((course) => {
            if (course.id !== courseId) return course;
            return {
              ...course,
              termId,
              status:
                termId === 'completed'
                  ? 'completed'
                  : course.status === 'completed'
                    ? 'planned'
                    : course.status,
            };
          }),
        );
      },
      removeCourse: (courseId) =>
        setCourses((current) => current.filter((course) => course.id !== courseId)),
      isCoursePlanned: (code) =>
        courses.some((course) => course.code === code && course.status !== 'failed'),
    };
  }, [courses, preferences, recommendations]);

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

function buildRecommendations(
  courses: PlanCourse[],
  preferences: PlanningPreferences,
  dismissedCodes: string[],
): PlanRecommendation[] {
  const completedCodes = new Set(
    courses.filter((course) => course.status === 'completed').map((course) => course.code),
  );
  const plannedCodes = new Set(
    courses.filter((course) => course.status !== 'failed').map((course) => course.code),
  );
  const careerInterests = careerInterestMap[preferences.careerDirection];
  const futureTerms = planTerms.filter(
    (term) => term.id !== 'completed' && term.id !== '2026-t1',
  );
  const targetLoad = preferences.workload === 'light' ? 12 : 18;

  return catalogCourses
    .filter(
      (course) =>
        !plannedCodes.has(course.code) &&
        !dismissedCodes.includes(course.code) &&
        course.prerequisites.every((code) => completedCodes.has(code)),
    )
    .map((course) => {
      const matchedPreferences: string[] = [];
      let score = 0;
      if (preferences.interests.includes(course.interestId)) {
        score += 4;
        matchedPreferences.push(course.interest);
      }
      if (careerInterests.includes(course.interestId)) {
        score += 3;
        matchedPreferences.push('career direction');
      }
      if (
        preferences.priorities.includes('practical-experience') &&
        ['software-engineering', 'web', 'product-design'].includes(course.interestId)
      ) {
        score += 2;
        matchedPreferences.push('practical experience');
      }
      const term = futureTerms.find((candidate) => {
        if (!course.terms.includes(candidate.id)) return false;
        const acceptedLoad = courses
          .filter((plannedCourse) => plannedCourse.termId === candidate.id)
          .reduce((sum, plannedCourse) => sum + plannedCourse.uoc, 0);
        return preferences.workload === 'flexible' || acceptedLoad + course.uoc <= targetLoad;
      });
      return term ? { course, termId: term.id, matchedPreferences, score } : null;
    })
    .filter(
      (item): item is NonNullable<typeof item> => Boolean(item && (item.score > 0 || preferences.careerDirection === 'exploring')),
    )
    .sort((a, b) => b.score - a.score || a.course.code.localeCompare(b.course.code))
    .slice(0, 3)
    .map(({ course, termId, matchedPreferences }) => ({
      course,
      termId,
      matchedPreferences,
      reason: recommendationReason(course, matchedPreferences),
    }));
}

const careerInterestMap: Record<PlanningPreferences['careerDirection'], CatalogCourse['interestId'][]> = {
  'ai-ml': ['ai', 'data'],
  'software-engineering': ['software-engineering', 'web', 'systems'],
  data: ['data', 'ai'],
  cybersecurity: ['systems', 'networks'],
  'product-ux': ['product-design', 'web'],
  research: ['ai', 'data', 'systems'],
  exploring: [],
};

function recommendationReason(course: CatalogCourse, matches: string[]) {
  const reason = matches.length ? matches.slice(0, 2).join(' and ') : 'your open elective space';
  return `${course.code} matches ${reason}; its listed prerequisites are complete.`;
}

export function usePlan() {
  const value = useContext(PlanContext);
  if (!value) throw new Error('usePlan must be used inside PlanProvider');
  return value;
}

export function getCatalogCourse(code: string) {
  return catalogCourses.find((course) => course.code === code);
}

export function getTermLabel(termId: PlanTermId) {
  return planTerms.find((term) => term.id === termId)?.shortLabel ?? termId;
}
