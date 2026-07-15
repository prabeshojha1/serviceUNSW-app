export interface User {
  id: string;
  zid: string;
  firstName: string;
  lastName: string;
}

export interface Society {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  coverImageUrl?: string;
}

export interface Event {
  id: string;
  societyId: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
}