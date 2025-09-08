import { CalendarEvent } from '../types/event';

// Check if current user can edit/delete an event
export function canEditEvent(event: CalendarEvent, currentUserId: string | null): boolean {
  if (!currentUserId) return false;
  return event.userId === currentUserId;
}

// Check if current user can create events
export function canCreateEvent(currentUserId: string | null): boolean {
  return currentUserId !== null;
}

// Filter events to show only editable ones for current user
export function getEditableEvents(events: CalendarEvent[], currentUserId: string | null): CalendarEvent[] {
  if (!currentUserId) return [];
  return events.filter(event => event.userId === currentUserId);
}

// Get all events (for display) but mark which ones are editable
export function getEventsWithEditStatus(events: CalendarEvent[], currentUserId: string | null): (CalendarEvent & { canEdit: boolean })[] {
  return events.map(event => ({
    ...event,
    canEdit: canEditEvent(event, currentUserId)
  }));
}
