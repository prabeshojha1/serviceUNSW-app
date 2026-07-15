import { CatalogCourse, PlanCourse, PlanTerm } from '@/types/plan';

export const DEGREE_TOTAL_UOC = 144;

export const planTerms: PlanTerm[] = [
  { id: 'completed', label: 'Completed courses', shortLabel: 'Completed', year: 'History', capacity: 144 },
  { id: '2026-t1', label: 'Term 1, 2026', shortLabel: 'T1 2026', year: 'Year 3', capacity: 18 },
  { id: '2026-t2', label: 'Term 2, 2026', shortLabel: 'T2 2026', year: 'Year 3', capacity: 18 },
  { id: '2026-t3', label: 'Term 3, 2026', shortLabel: 'T3 2026', year: 'Year 3', capacity: 18 },
  { id: '2027-t1', label: 'Term 1, 2027', shortLabel: 'T1 2027', year: 'Year 4', capacity: 18 },
];

export const catalogCourses: CatalogCourse[] = [
  {
    code: 'COMP3231', title: 'Operating Systems', uoc: 6,
    terms: ['2026-t1', '2026-t3'], prerequisites: ['COMP2521'], interest: 'Systems',
    description: 'Processes, memory, concurrency, file systems, and the design of modern operating systems.',
  },
  {
    code: 'COMP3311', title: 'Database Systems', uoc: 6,
    terms: ['2026-t1', '2026-t2'], prerequisites: ['COMP2521'], interest: 'Data',
    description: 'Data modelling, relational design, SQL, transactions, and database implementation.',
  },
  {
    code: 'COMP3331', title: 'Computer Networks and Applications', uoc: 6,
    terms: ['2026-t2', '2026-t3'], prerequisites: ['COMP2521'], interest: 'Networks',
    description: 'Internet architecture, transport protocols, routing, and networked application design.',
  },
  {
    code: 'COMP3411', title: 'Artificial Intelligence', uoc: 6,
    terms: ['2026-t1', '2026-t3'], prerequisites: ['COMP2521', 'MATH1081'], interest: 'AI',
    description: 'Search, reasoning, planning, machine learning, and intelligent agent design.',
  },
  {
    code: 'COMP3511', title: 'Human Computer Interaction', uoc: 6,
    terms: ['2026-t2'], prerequisites: ['COMP1531'], interest: 'Product design',
    description: 'Human-centred research, interaction design, prototyping, and usability evaluation.',
  },
  {
    code: 'COMP3900', title: 'Computer Science Project', uoc: 6,
    terms: ['2026-t1', '2026-t2', '2026-t3'], prerequisites: ['COMP1531', 'COMP2521'], interest: 'Software engineering',
    description: 'A team-based capstone that applies software engineering practice to a substantial project.',
  },
  {
    code: 'COMP4920', title: 'Professional Issues and Ethics', uoc: 6,
    terms: ['2026-t1', '2026-t2'], prerequisites: [], interest: 'Professional practice',
    description: 'Ethical, legal, social, and professional issues in computing practice.',
  },
  {
    code: 'COMP6080', title: 'Web Front-End Programming', uoc: 6,
    terms: ['2026-t1', '2026-t3'], prerequisites: ['COMP1531'], interest: 'Web development',
    description: 'Modern browser programming, accessibility, interface architecture, and web application quality.',
  },
];

export const initialPlanCourses: PlanCourse[] = [
  { id: 'done-1511', code: 'COMP1511', title: 'Programming Fundamentals', uoc: 6, status: 'completed', termId: 'completed' },
  { id: 'done-1521', code: 'COMP1521', title: 'Computer Systems Fundamentals', uoc: 6, status: 'completed', termId: 'completed' },
  { id: 'done-1531', code: 'COMP1531', title: 'Software Engineering Fundamentals', uoc: 6, status: 'completed', termId: 'completed' },
  { id: 'done-2521', code: 'COMP2521', title: 'Data Structures and Algorithms', uoc: 6, status: 'completed', termId: 'completed' },
  { id: 'done-1081', code: 'MATH1081', title: 'Discrete Mathematics', uoc: 6, status: 'completed', termId: 'completed' },
  { id: 'done-1131', code: 'MATH1131', title: 'Mathematics 1A', uoc: 6, status: 'completed', termId: 'completed' },
  { id: 'done-1231', code: 'MATH1231', title: 'Mathematics 1B', uoc: 6, status: 'completed', termId: 'completed' },
  { id: 'done-gen', code: 'GENC3004', title: 'Personal Finance', uoc: 6, status: 'completed', termId: 'completed' },
  { id: 'plan-3231', code: 'COMP3231', title: 'Operating Systems', uoc: 6, status: 'in-progress', termId: '2026-t1', prerequisites: ['COMP2521'], interest: 'Systems' },
  { id: 'plan-3311', code: 'COMP3311', title: 'Database Systems', uoc: 6, status: 'planned', termId: '2026-t1', prerequisites: ['COMP2521'], interest: 'Data' },
  { id: 'plan-3900', code: 'COMP3900', title: 'Computer Science Project', uoc: 6, status: 'planned', termId: '2026-t2', prerequisites: ['COMP1531', 'COMP2521'], interest: 'Software engineering' },
  { id: 'plan-4920', code: 'COMP4920', title: 'Professional Issues and Ethics', uoc: 6, status: 'planned', termId: '2026-t2', interest: 'Professional practice' },
  { id: 'plan-3411', code: 'COMP3411', title: 'Artificial Intelligence', uoc: 6, status: 'recommended', termId: '2026-t3', prerequisites: ['COMP2521', 'MATH1081'], interest: 'AI', reason: 'It matches your AI interest and both prerequisites are complete.' },
];
