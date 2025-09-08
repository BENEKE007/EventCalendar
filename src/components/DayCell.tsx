import { CalendarEvent } from '../types/event';
import { toYMD } from '../lib/dateUtils';
import { useTheme } from '../lib/themeContext';

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
  const { themeConfig } = useTheme();
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

  // Determine cell styling based on state
  const getCellStyle = () => {
    let backgroundColor = 'transparent';
    let color = themeConfig.colors.onBackground;
    let fontWeight = themeConfig.typography.fontWeight.normal;
    let borderRadius = '0';
    let border = 'none';

    // Check if it's Sunday (index 0 in week)
    const isSunday = date.getDay() === 0;

    if (isSelected) {
      backgroundColor = 'transparent';
      color = themeConfig.colors.onBackground;
      fontWeight = themeConfig.typography.fontWeight.medium;
      border = `1px solid ${themeConfig.colors.selected}`;
    } else if (isMuted) {
      color = themeConfig.colors.muted;
    } else if (isSunday) {
      color = themeConfig.colors.sunday;
    } else if (eventCount > 0) {
      fontWeight = themeConfig.typography.fontWeight.medium;
    }

    return {
      backgroundColor,
      color,
      fontWeight,
      borderRadius,
      border,
    };
  };

  // Determine number styling for today
  const getNumberStyle = () => {
    if (isToday) {
      return {
        backgroundColor: themeConfig.colors.today,
        color: themeConfig.colors.onPrimary,
        fontWeight: themeConfig.typography.fontWeight.medium,
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
      };
    }
    return {};
  };

  const cellStyle = getCellStyle();

  return (
    <div className="relative">
      <button
        className="android-calendar-day mobile:min-h-12 mobile:min-w-12"
        style={{
          ...cellStyle,
          opacity: isMuted ? 0.5 : 1,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          paddingTop: '4px',
          paddingLeft: '4px',
          paddingRight: '4px',
          paddingBottom: '4px',
        }}
        onClick={onClick}
        title={eventTooltip}
      >
        {/* Date number at the top */}
        <div 
          className={`${isCompact ? 'text-xs' : 'text-sm'} w-full text-center`} 
          style={{ 
            fontFamily: themeConfig.typography.fontFamily,
            ...getNumberStyle()
          }}
        >
          {dayNumber}
        </div>
        
        {/* Event dots in the remaining space */}
        {eventCount > 0 && (
          <div className={`absolute left-1/2 transform -translate-x-1/2 flex gap-0.5 items-center flex-wrap justify-center max-w-[calc(100%-8px)] ${isCompact ? 'bottom-1 gap-0.5' : 'bottom-2'}`} style={{ top: '50%' }}>
            {/* KZN Events - Primary color dots */}
            {kznEvents.slice(0, isCompact ? 2 : 3).map((_, i) => (
              <span 
                key={`kzn-${i}`} 
                className="android-event-indicator"
                style={{ 
                  backgroundColor: themeConfig.colors.eventIndicator,
                  width: isCompact ? '4px' : '6px',
                  height: isCompact ? '4px' : '6px',
                }}
              />
            ))}
            {/* Gauteng Events - Secondary color dots */}
            {gautengEvents.slice(0, isCompact ? 2 : 3).map((_, i) => (
              <span 
                key={`gauteng-${i}`} 
                className="android-event-indicator secondary"
                style={{ 
                  backgroundColor: themeConfig.colors.eventIndicatorSecondary,
                  width: isCompact ? '4px' : '6px',
                  height: isCompact ? '4px' : '6px',
                }}
              />
            ))}
            {/* Show "+" indicator if there are more events than dots */}
            {eventCount > dotsToShow && (
              <span 
                className="android-event-indicator"
                style={{ 
                  backgroundColor: themeConfig.colors.muted,
                  width: isCompact ? '6px' : '8px',
                  height: isCompact ? '6px' : '8px',
                  fontSize: isCompact ? '8px' : '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: themeConfig.colors.onPrimary,
                  fontWeight: themeConfig.typography.fontWeight.semibold,
                }}
              >
                +
              </span>
            )}
          </div>
        )}
      </button>
      {/* Gold line under selected date */}
      {isSelected && (
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5"
          style={{ backgroundColor: themeConfig.colors.selected }}
        />
      )}
    </div>
  );
}
