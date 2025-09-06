import { useState, useEffect, useMemo } from 'react';
import AddEventForm from './components/AddEventForm';
import Calendar from './components/Calendar';
import { CalendarEvent, CalendarView, Region } from './types/event';
import { loadEvents, saveEvents, loadRegion, saveRegion } from './lib/storage';
import { startOfWeek } from './lib/dateUtils';
import './App.css';

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region>('All');
  const [view, setView] = useState<CalendarView>('month');
  const [cursor, setCursor] = useState<Date>(new Date());

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

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  const handleRegionChange = (region: Region) => {
    setSelectedRegion(region);
  };

  const handleViewChange = (newView: CalendarView) => {
    setView(newView);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newCursor = new Date(cursor);
    const delta = direction === 'next' ? 1 : -1;
    
    if (view === 'week') {
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
    <div className="container">
      <h1>Event Calendar</h1>
      
      <AddEventForm onAdd={handleAddEvent} />
      
      <div className="card">
        <div className="controls">
          <div className="btnbar">
            <button onClick={() => handleNavigate('prev')} title="Previous">◀</button>
            <button onClick={handleToday} title="Today">Today</button>
            <button onClick={() => handleNavigate('next')} title="Next">▶</button>
          </div>
          <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
            <div className="subtle">
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
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
            <select 
              value={selectedRegion} 
              onChange={(e) => handleRegionChange(e.target.value as Region)}
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

      <div style={{ height: '12px' }} />
      
      <div className="card">
        <h2 style={{ margin: '0 0 8px', fontSize: '1.1rem' }}>
          {selectedDate ? `Events on ${selectedDate}` : 'Select a date to view events'}
        </h2>
        <div className="list">
          {selectedDateEvents.length === 0 ? (
            <div className="item subtle">No events for this date.</div>
          ) : (
            selectedDateEvents.map((event) => (
              <div key={event.id} className="item">
                <div><strong>Club:</strong> {event.club}</div>
                <div className="subtle" style={{ fontSize: '.8rem' }}>
                  {event.date} · {event.region}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 8px', fontSize: '1.1rem' }}>Event Indicators</h2>
        <div className="legend">
          <div className="legend-item">
            <span className="event-dot kzn-dot"></span>
            <span>KZN Events</span>
          </div>
          <div className="legend-item">
            <span className="event-dot gauteng-dot"></span>
            <span>Gauteng Events</span>
          </div>
          <div className="legend-item">
            <span className="event-dot more-dot">+</span>
            <span>Additional Events</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

