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
      className={`
        relative aspect-square w-full border border-gray-200 dark:border-gray-700 rounded-lg text-left bg-white dark:bg-slate-900 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200
        ${isToday ? 'border-blue-500 dark:border-blue-400' : ''}
        ${isSelected ? 'outline-2 outline-blue-600 dark:outline-blue-400 outline-offset-[-2px] bg-blue-50 dark:bg-blue-900/20' : ''}
        ${isMuted ? 'opacity-50' : ''}
        ${eventCount > 0 ? 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-slate-300 dark:border-slate-600 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-600' : ''}
      `}
      onClick={onClick}
      title={eventTooltip}
    >
      <div className={`p-1.5 text-sm ${isCompact ? 'text-xs' : ''}`}>
        {dayNumber}
      </div>
      {eventCount > 0 && (
        <div className={`absolute bottom-1.5 left-1/2 transform -translate-x-1/2 flex gap-0.5 items-center flex-wrap justify-center max-w-[calc(100%-12px)] ${isCompact ? 'bottom-1 gap-0.5' : ''}`}>
          {/* KZN Events - Blue dots */}
          {kznEvents.slice(0, isCompact ? 2 : 3).map((_, i) => (
            <span key={`kzn-${i}`} className={`w-1.5 h-1.5 rounded-full bg-kzn flex-shrink-0 flex items-center justify-center text-xs font-semibold text-white shadow-sm ${isCompact ? 'w-1 h-1 text-xs' : ''}`} />
          ))}
          {/* Gauteng Events - Green dots */}
          {gautengEvents.slice(0, isCompact ? 2 : 3).map((_, i) => (
            <span key={`gauteng-${i}`} className={`w-1.5 h-1.5 rounded-full bg-gauteng flex-shrink-0 flex items-center justify-center text-xs font-semibold text-white shadow-sm ${isCompact ? 'w-1 h-1 text-xs' : ''}`} />
          ))}
          {/* Show "+" indicator if there are more events than dots */}
          {eventCount > dotsToShow && (
            <span className={`w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 flex items-center justify-center text-xs font-semibold text-white shadow-sm ${isCompact ? 'w-1.5 h-1.5 text-xs' : ''}`}>+</span>
          )}
        </div>
      )}
    </button>
  );
}
