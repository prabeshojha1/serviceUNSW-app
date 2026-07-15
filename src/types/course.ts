export interface Course {
  code: string;
  title: string;
  uoc: number;
  level: number;
  terms: string[];
  saved?: boolean;
}