import { useState, useEffect, useMemo } from 'react';
import EventForm from './components/EventForm';
import Calendar from './components/Calendar';
import BurgerMenu from './components/BurgerMenu';
import { CalendarEvent, CalendarView, Region } from './types/event';
import { loadEvents, saveEvents, loadRegion, saveRegion, updateEvent, deleteEvent } from './lib/storage';
import { startOfWeek } from './lib/dateUtils';
import { useTheme } from './lib/themeContext';

function App() {
  const { themeConfig } = useTheme();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region>('All');
  const [view, setView] = useState<CalendarView>('month');
  const [cursor, setCursor] = useState<Date>(new Date());
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedEvents, loadedRegion] = await Promise.all([
          loadEvents(),
          loadRegion()
        ]);
        setEvents(loadedEvents);
        setSelectedRegion(loadedRegion);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };
    
    loadData();
  }, []);

  // Save events when they change
  useEffect(() => {
    if (events.length > 0) {
      saveEvents(events).catch(error => {
        console.error('Failed to save events:', error);
      });
    }
  }, [events]);

  // Save region when it changes
  useEffect(() => {
    saveRegion(selectedRegion).catch(error => {
      console.error('Failed to save region:', error);
    });
  }, [selectedRegion]);

  const handleAddEvent = (newEvent: CalendarEvent) => {
    setEvents(prev => [...prev, newEvent]);
    setShowEventForm(false); // Hide form after adding event
  };

  const handleUpdateEvent = async (updatedEvent: CalendarEvent) => {
    try {
      await updateEvent(updatedEvent);
      setEvents(prev => prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      ));
      setEditingEvent(null);
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
        setEvents(prev => prev.filter(event => event.id !== eventId));
        setEditingEvent(null);
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setShowEventForm(true); // Show form when editing
  };

  const handleShowEventForm = () => {
    setShowEventForm(true);
    setEditingEvent(null); // Clear any editing state
  };

  const handleHideEventForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  const handleRegionChange = (region: Region) => {
    setSelectedRegion(region);
  };

  const handleViewChange = (newView: CalendarView) => {
    setView(newView);
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newCursor = new Date(cursor);
    const delta = direction === 'next' ? 1 : -1;
    
    if (view === 'day') {
      newCursor.setDate(newCursor.getDate() + delta);
    } else if (view === 'week') {
      newCursor.setDate(newCursor.getDate() + (delta * 7));
    } else if (view === 'month') {
      newCursor.setMonth(newCursor.getMonth() + delta);
    } else if (view === 'year') {
      newCursor.setFullYear(newCursor.getFullYear() + delta);
    }
    setCursor(newCursor);
  };

  const handleToday = () => {
    setCursor(new Date());
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
        return; // Don't interfere with form inputs
      }
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleNavigate('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNavigate('next');
          break;
        case 'Home':
          e.preventDefault();
          handleToday();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cursor, view]);

  // Filter events by selected region
  const filteredEvents = useMemo(() => {
    if (selectedRegion === 'All') return events;
    return events.filter(e => e.region === selectedRegion);
  }, [events, selectedRegion]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return filteredEvents.filter(e => e.date === selectedDate);
  }, [filteredEvents, selectedDate]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeConfig.colors.background }}>
      {/* Android-style App Bar */}
      <div className="android-header">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BurgerMenu 
                currentView={view} 
                onViewChange={handleViewChange}
                isDarkMode={isDarkMode}
                onDarkModeToggle={handleDarkModeToggle}
                onShowEventForm={handleShowEventForm}
                selectedRegion={selectedRegion}
                onRegionChange={handleRegionChange}
              />
              <h1 className="text-xl font-medium m-0" style={{ color: themeConfig.colors.onPrimary }}>
                Event Calendar
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 mobile:p-2">
        {/* Event Form */}
        {showEventForm && (
          <EventForm 
            onAdd={handleAddEvent}
            onUpdate={handleUpdateEvent}
            editingEvent={editingEvent}
            onCancel={handleHideEventForm}
          />
        )}
        
        {/* Calendar Card */}
        <div className="android-card mb-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b mobile:flex-col mobile:gap-4" style={{ borderColor: themeConfig.colors.outline }}>
            <div className="flex items-center gap-2 mobile:order-2">
              <button 
                onClick={() => handleNavigate('prev')} 
                title="Previous"
                className="android-button-outlined mobile:flex-1"
                style={{ minWidth: '40px', height: '40px', padding: '0' }}
              >
                ◀
              </button>
              <button 
                onClick={handleToday} 
                title="Today"
                className="android-button-outlined mobile:flex-1"
                style={{ minWidth: '60px', height: '40px' }}
              >
                Today
              </button>
              <button 
                onClick={() => handleNavigate('next')} 
                title="Next"
                className="android-button-outlined mobile:flex-1"
                style={{ minWidth: '40px', height: '40px', padding: '0' }}
              >
                ▶
              </button>
            </div>
            <div className="text-center mobile:order-1">
              <h2 className="text-2xl font-medium m-0 mobile:text-xl" style={{ color: themeConfig.colors.onSurface }}>
                {view === 'day' && cursor.toLocaleDateString(undefined, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                {view === 'month' && cursor.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
                {view === 'week' && (() => {
                  const start = startOfWeek(cursor);
                  const end = new Date(start);
                  end.setDate(start.getDate() + 6);
                  return `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`;
                })()}
                {view === 'year' && cursor.getFullYear().toString()}
              </h2>
            </div>
            <div className="mobile:hidden"></div> {/* Spacer for centering - hidden on mobile */}
          </div>
          
          {/* Calendar Grid */}
          <div className="p-4">
            <Calendar
              view={view}
              cursor={cursor}
              events={filteredEvents}
              selectedDate={selectedDate}
              onDateSelect={handleSelectDate}
            />
          </div>
        </div>

        {/* Events List */}
        <div className="android-card mb-4">
          <div className="p-4">
            <h2 className="text-lg font-medium m-0 mb-3" style={{ color: themeConfig.colors.onSurface }}>
              {selectedDate ? `Events on ${selectedDate}` : 'Select a date to view events'}
            </h2>
            <div className="space-y-2">
              {selectedDateEvents.length === 0 ? (
                <div className="p-4 text-center" style={{ color: themeConfig.colors.muted }}>
                  No events for this date.
                </div>
              ) : (
                selectedDateEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="flex justify-between items-center p-3 rounded-lg border"
                    style={{ 
                      backgroundColor: themeConfig.colors.outlineVariant,
                      borderColor: themeConfig.colors.outline
                    }}
                  >
                    <div>
                      <div className="font-medium" style={{ color: themeConfig.colors.onSurface }}>
                        {event.club}
                      </div>
                      <div className="text-sm" style={{ color: themeConfig.colors.muted }}>
                        {event.date} · {event.region}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="android-button-outlined"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        title="Edit event"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="android-button"
                        style={{ 
                          backgroundColor: themeConfig.colors.error,
                          padding: '4px 8px', 
                          fontSize: '12px' 
                        }}
                        title="Delete event"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Event Indicators */}
        <div className="android-card">
          <div className="p-4">
            <h2 className="text-lg font-medium m-0 mb-3" style={{ color: themeConfig.colors.onSurface }}>
              Event Indicators
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 text-sm">
                <span 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: themeConfig.colors.eventIndicator }}
                ></span>
                <span style={{ color: themeConfig.colors.onSurface }}>KZN Events</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: themeConfig.colors.eventIndicatorSecondary }}
                ></span>
                <span style={{ color: themeConfig.colors.onSurface }}>Gauteng Events</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span 
                  className="w-2 h-2 rounded-full flex items-center justify-center text-xs text-white font-semibold"
                  style={{ backgroundColor: themeConfig.colors.muted }}
                >+</span>
                <span style={{ color: themeConfig.colors.onSurface }}>Additional Events</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

