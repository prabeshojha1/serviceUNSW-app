import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

import { catalogCourses, DEGREE_TOTAL_UOC, initialPlanCourses, planTerms } from '@/data/plan';
import { CatalogCourse, PlanCourse, PlanTermId } from '@/types/plan';

interface PlanContextValue {
  courses: PlanCourse[];
  completedUoc: number;
  plannedUoc: number;
  remainingUoc: number;
  addCourse: (course: CatalogCourse, termId: PlanTermId) => void;
  moveCourse: (courseId: string, termId: PlanTermId) => void;
  removeCourse: (courseId: string) => void;
  isCoursePlanned: (code: string) => boolean;
}

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: PropsWithChildren) {
  const [courses, setCourses] = useState(initialPlanCourses);

  const value = useMemo<PlanContextValue>(() => {
    const completedUoc = courses
      .filter((course) => course.status === 'completed')
      .reduce((sum, course) => sum + course.uoc, 0);
    const plannedUoc = courses
      .filter((course) => course.status !== 'completed' && course.status !== 'failed')
      .reduce((sum, course) => sum + course.uoc, 0);

    return {
      courses,
      completedUoc,
      plannedUoc,
      remainingUoc: Math.max(0, DEGREE_TOTAL_UOC - completedUoc),
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
              prerequisites: course.prerequisites,
              interest: course.interest,
            },
          ];
        });
      },
      moveCourse: (courseId, termId) => {
        setCourses((current) => current.map((course) => {
          if (course.id !== courseId) return course;
          return {
            ...course,
            termId,
            status: termId === 'completed' ? 'completed' : course.status === 'completed' ? 'planned' : course.status,
          };
        }));
      },
      removeCourse: (courseId) => setCourses((current) => current.filter((course) => course.id !== courseId)),
      isCoursePlanned: (code) => courses.some((course) => course.code === code && course.status !== 'failed'),
    };
  }, [courses]);

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
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
