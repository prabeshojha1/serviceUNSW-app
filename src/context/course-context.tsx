import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

import { PlanTermId } from '@/types/plan';

export type PrerequisiteFilter = 'all' | 'none' | 'required';

export interface CourseFilters {
  term: 'all' | PlanTermId;
  level: 'all' | '1' | '2' | '3' | '4+';
  prerequisites: PrerequisiteFilter;
}

const defaultFilters: CourseFilters = {
  term: 'all',
  level: 'all',
  prerequisites: 'all',
};

interface CourseContextValue {
  savedCodes: string[];
  compareCodes: string[];
  filters: CourseFilters;
  toggleSaved: (code: string) => void;
  toggleCompare: (code: string) => void;
  removeFromCompare: (code: string) => void;
  setFilters: (filters: CourseFilters) => void;
  resetFilters: () => void;
}

const CourseContext = createContext<CourseContextValue | null>(null);

export function CourseProvider({ children }: PropsWithChildren) {
  const [savedCodes, setSavedCodes] = useState(['COMP2521', 'MATH1081']);
  const [compareCodes, setCompareCodes] = useState(['COMP2521', 'COMP3331']);
  const [filters, setFilters] = useState<CourseFilters>(defaultFilters);

  const value = useMemo<CourseContextValue>(
    () => ({
      savedCodes,
      compareCodes,
      filters,
      toggleSaved: (code) =>
        setSavedCodes((current) =>
          current.includes(code) ? current.filter((item) => item !== code) : [...current, code],
        ),
      toggleCompare: (code) =>
        setCompareCodes((current) => {
          if (current.includes(code)) return current.filter((item) => item !== code);
          if (current.length >= 3) return [...current.slice(1), code];
          return [...current, code];
        }),
      removeFromCompare: (code) =>
        setCompareCodes((current) => current.filter((item) => item !== code)),
      setFilters,
      resetFilters: () => setFilters(defaultFilters),
    }),
    [compareCodes, filters, savedCodes],
  );

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourseLibrary() {
  const value = useContext(CourseContext);
  if (!value) throw new Error('useCourseLibrary must be used inside CourseProvider');
  return value;
}
