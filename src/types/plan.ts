export type CourseStatus = 'completed' | 'in-progress' | 'planned' | 'failed';

export type PlanTermId = 'completed' | '2026-t1' | '2026-t2' | '2026-t3' | '2027-t1';

export type RequirementId = 'core' | 'computing-electives' | 'general-education' | 'free-electives';

export type CareerDirection =
  | 'ai-ml'
  | 'software-engineering'
  | 'data'
  | 'cybersecurity'
  | 'product-ux'
  | 'research'
  | 'exploring';

export type InterestId =
  | 'ai'
  | 'data'
  | 'software-engineering'
  | 'web'
  | 'systems'
  | 'networks'
  | 'product-design';

export type WorkloadPreference = 'light' | 'balanced' | 'flexible';

export type PlanningPriority =
  | 'prerequisites-first'
  | 'graduate-on-time'
  | 'protect-wam'
  | 'practical-experience'
  | 'manage-workload';

export interface PlanningPreferences {
  careerDirection: CareerDirection;
  interests: InterestId[];
  workload: WorkloadPreference;
  priorities: PlanningPriority[];
}

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
  requirementId: RequirementId;
  prerequisites?: string[];
  interest?: string;
}

export interface CatalogCourse {
  code: string;
  title: string;
  uoc: number;
  terms: PlanTermId[];
  prerequisites: string[];
  interest: string;
  interestId: InterestId;
  requirementId: RequirementId;
  description: string;
}

export interface PlanRecommendation {
  course: CatalogCourse;
  termId: PlanTermId;
  reason: string;
  matchedPreferences: string[];
}

export interface DegreeRequirement {
  id: RequirementId;
  label: string;
  requiredUoc: number;
  description: string;
}

export interface DegreeRequirementProgress extends DegreeRequirement {
  completedUoc: number;
  plannedUoc: number;
  outstandingUoc: number;
}
