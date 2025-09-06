export type CalendarView = 'day' | 'week' | 'month' | 'year';

export interface CalendarEvent {
  id: string;
  club: string;
  date: string; // yyyy-mm-dd format
  region: 'KZN' | 'Gauteng';
}

export type Region = 'All' | 'KZN' | 'Gauteng';


