export type CalendarEventType = 'class' | 'society' | 'deadline' | 'general';

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  courseCode?: string;
  organizer?: string;
  description?: string;
  remindersEnabled: boolean;
  reminderOffset?: number;
}
