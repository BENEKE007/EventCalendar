import { CalendarEvent } from '../types/event';
import { toYMD } from '../lib/dateUtils';

interface DayCellProps {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isSelected: boolean;
  isMuted: boolean;
  isCompact?: boolean;
  onClick: () => void;
}

export default function DayCell({ 
  date, 
  events, 
  isToday, 
  isSelected, 
  isMuted, 
  isCompact = false, 
  onClick 
}: DayCellProps) {
  const dayNumber = date.getDate();
  const eventCount = events.length;
  const maxDots = isCompact ? 3 : 5; // Show fewer dots in compact mode
  const dotsToShow = Math.min(eventCount, maxDots);

  // Group events by region for different colored indicators
  const kznEvents = events.filter(e => e.region === 'KZN');
  const gautengEvents = events.filter(e => e.region === 'Gauteng');

  // Create event tooltip text
  const eventTooltip = events.length > 0 
    ? `${toYMD(date)} - ${events.length} event${events.length > 1 ? 's' : ''}:\n${events.map(e => `• ${e.club} (${e.region})`).join('\n')}`
    : toYMD(date);

  return (
    <button
      className={`day ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''} ${isMuted ? 'muted' : ''} ${eventCount > 0 ? 'has-events' : ''}`}
      onClick={onClick}
      title={eventTooltip}
    >
      <div className={`day-label ${isCompact ? 'compact' : ''}`}>
        {dayNumber}
      </div>
      {eventCount > 0 && (
        <div className={`event-indicators ${isCompact ? 'compact' : ''}`}>
          {/* KZN Events - Blue dots */}
          {kznEvents.slice(0, isCompact ? 2 : 3).map((_, i) => (
            <span key={`kzn-${i}`} className="event-dot kzn-dot" />
          ))}
          {/* Gauteng Events - Green dots */}
          {gautengEvents.slice(0, isCompact ? 2 : 3).map((_, i) => (
            <span key={`gauteng-${i}`} className="event-dot gauteng-dot" />
          ))}
          {/* Show "+" indicator if there are more events than dots */}
          {eventCount > dotsToShow && (
            <span className="event-dot more-dot">+</span>
          )}
        </div>
      )}
    </button>
  );
}
