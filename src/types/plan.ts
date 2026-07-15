export type CourseStatus =
  | 'completed'
  | 'in-progress'
  | 'planned'
  | 'recommended'
  | 'failed';

export type PlanTermId = 'completed' | '2026-t1' | '2026-t2' | '2026-t3' | '2027-t1';

export interface PlanTerm {
  id: PlanTermId;
  label: string;
  shortLabel: string;
  year: string;
  capacity: number;
}

export interface PlanCourse {
  id: string;
  code: string;
  title: string;
  uoc: number;
  status: CourseStatus;
  termId: PlanTermId;
  prerequisites?: string[];
  interest?: string;
  reason?: string;
}

export interface CatalogCourse {
  code: string;
  title: string;
  uoc: number;
  terms: PlanTermId[];
  prerequisites: string[];
  interest: string;
  description: string;
}
