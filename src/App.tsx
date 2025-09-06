import { useState, useEffect, useMemo } from 'react';
import EventForm from './components/EventForm';
import Calendar from './components/Calendar';
import BurgerMenu from './components/BurgerMenu';
import { CalendarEvent, CalendarView, Region } from './types/event';
import { loadEvents, saveEvents, loadRegion, saveRegion, updateEvent, deleteEvent } from './lib/storage';
import { startOfWeek } from './lib/dateUtils';

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region>('All');
  const [view, setView] = useState<CalendarView>('month');
  const [cursor, setCursor] = useState<Date>(new Date());
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
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
  };

  const handleCancelEdit = () => {
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
    <div className={`max-w-6xl mx-auto p-4 ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex items-center gap-3 mb-3">
        <BurgerMenu 
          currentView={view} 
          onViewChange={handleViewChange}
          isDarkMode={isDarkMode}
          onDarkModeToggle={handleDarkModeToggle}
        />
        <h1 className="text-2xl font-semibold m-0">Event Calendar</h1>
      </div>
      
      <EventForm 
        onAdd={handleAddEvent}
        onUpdate={handleUpdateEvent}
        editingEvent={editingEvent}
        onCancel={handleCancelEdit}
      />
      
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="inline-flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button 
              onClick={() => handleNavigate('prev')} 
              title="Previous"
              className="bg-white dark:bg-slate-900 border-none px-2.5 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 active:bg-gray-100 dark:active:bg-slate-700 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ◀
            </button>
            <button 
              onClick={handleToday} 
              title="Today"
              className="bg-white dark:bg-slate-900 border-none px-2.5 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 active:bg-gray-100 dark:active:bg-slate-700 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Today
            </button>
            <button 
              onClick={() => handleNavigate('next')} 
              title="Next"
              className="bg-white dark:bg-slate-900 border-none px-2.5 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 active:bg-gray-100 dark:active:bg-slate-700 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ▶
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <div className="text-gray-500 dark:text-gray-400 text-sm">
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
            </div>
            <select 
              value={view} 
              onChange={(e) => handleViewChange(e.target.value as CalendarView)}
              className="border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-2 bg-white dark:bg-slate-900 text-inherit"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
            <select 
              value={selectedRegion} 
              onChange={(e) => handleRegionChange(e.target.value as Region)}
              className="border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-2 bg-white dark:bg-slate-900 text-inherit"
            >
              <option value="All">All</option>
              <option value="KZN">KZN</option>
              <option value="Gauteng">Gauteng</option>
            </select>
          </div>
        </div>
        
        <Calendar
          view={view}
          cursor={cursor}
          events={filteredEvents}
          selectedDate={selectedDate}
          onDateSelect={handleSelectDate}
        />
      </div>

      <div className="h-3" />
      
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h2 className="m-0 mb-2 text-lg">
          {selectedDate ? `Events on ${selectedDate}` : 'Select a date to view events'}
        </h2>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
          {selectedDateEvents.length === 0 ? (
            <div className="p-3 text-gray-500 dark:text-gray-400 text-sm">No events for this date.</div>
          ) : (
            selectedDateEvents.map((event) => (
              <div key={event.id} className="p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 flex justify-between items-center">
                <div>
                  <div><strong>Club:</strong> {event.club}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">
                    {event.date} · {event.region}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-xs bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
                    title="Edit event"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30"
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

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h2 className="m-0 mb-2 text-lg">Event Indicators</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-kzn flex-shrink-0"></span>
            <span>KZN Events</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gauteng flex-shrink-0"></span>
            <span>Gauteng Events</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 flex items-center justify-center text-xs text-white font-semibold">+</span>
            <span>Additional Events</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

