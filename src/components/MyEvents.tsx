import { CalendarEvent } from '../types/event';
import { useTheme } from '../lib/themeContext';

interface MyEventsProps {
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function MyEvents({ events, onEditEvent, onDeleteEvent, onClose, isOpen }: MyEventsProps) {
  const { themeConfig } = useTheme();

  // Sort events by date (most recent first)
  const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg border"
        style={{ 
          backgroundColor: themeConfig.colors.surface,
          borderColor: themeConfig.colors.outline
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex justify-between items-center p-4 border-b"
          style={{ borderColor: themeConfig.colors.outline }}
        >
          <h2 
            className="text-xl font-semibold m-0"
            style={{ color: themeConfig.colors.onSurface }}
          >
            My Events
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all duration-200 hover:bg-opacity-10"
            style={{ 
              color: themeConfig.colors.muted,
              backgroundColor: 'transparent'
            }}
            aria-label="Close My Events"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {sortedEvents.length === 0 ? (
            <div 
              className="text-center py-8"
              style={{ color: themeConfig.colors.muted }}
            >
              <div className="text-4xl mb-4">📅</div>
              <p className="text-lg mb-2">No events created yet</p>
              <p className="text-sm">Create your first event to see it here!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex justify-between items-center p-4 rounded-lg border"
                  style={{
                    backgroundColor: themeConfig.colors.primaryVariant,
                    borderColor: themeConfig.colors.primary
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 
                        className="font-semibold text-lg m-0"
                        style={{ color: themeConfig.colors.onSurface }}
                      >
                        {event.club}
                      </h3>
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: themeConfig.colors.primary,
                          color: themeConfig.colors.onPrimary
                        }}
                      >
                        Your Event
                      </span>
                    </div>
                    <div 
                      className="text-sm mb-1"
                      style={{ color: themeConfig.colors.muted }}
                    >
                      📅 {new Date(event.date).toLocaleDateString(undefined, { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: themeConfig.colors.muted }}
                    >
                      📍 {event.region}
                    </div>
                    <div 
                      className="text-xs mt-2"
                      style={{ color: themeConfig.colors.muted }}
                    >
                      Created: {event.createdAt.toLocaleDateString()} at {event.createdAt.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => onEditEvent(event)}
                      className="android-button-outlined"
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                      title="Edit event"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteEvent(event.id)}
                      className="android-button"
                      style={{ 
                        backgroundColor: themeConfig.colors.error,
                        padding: '8px 16px', 
                        fontSize: '14px' 
                      }}
                      title="Delete event"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
