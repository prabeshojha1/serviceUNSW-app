export type SocietyCategory = 'Academic' | 'Social' | 'Sports' | 'Arts';

export interface Society {
  id: string;
  name: string;
  shortName: string;
  category: SocietyCategory;
  description: string;
  memberCount: number;
  image: string;
}

export interface SocietyEvent {
  id: string;
  societyId: string;
  title: string;
  summary: string;
  date: string;
  time: string;
  location: string;
  image: string;
}
