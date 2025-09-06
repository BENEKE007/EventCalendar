import { CalendarEvent, Region } from '../types/event';

const STORAGE_KEY = 'event_calendar_events_v1';
const REGION_KEY = 'event_calendar_region_v1';

export function loadEvents(): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const events = JSON.parse(raw) as CalendarEvent[];
    return Array.isArray(events) ? events : [];
  } catch {
    return [];
  }
}

export function saveEvents(events: CalendarEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function loadRegion(): Region {
  try {
    const r = localStorage.getItem(REGION_KEY);
    return (r === 'All' || r === 'KZN' || r === 'Gauteng') ? r : 'All';
  } catch {
    return 'All';
  }
}

export function saveRegion(region: Region): void {
  localStorage.setItem(REGION_KEY, region);
}


