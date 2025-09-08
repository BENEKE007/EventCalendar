import { useState, useEffect, useMemo } from 'react';
import EventForm from './components/EventForm';
import Calendar from './components/Calendar';
import BurgerMenu from './components/BurgerMenu';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import MyEvents from './components/MyEvents';
import ThemeSync from './components/ThemeSync';
import { CalendarEvent, CalendarView, Region } from './types/event';
import { loadEvents, saveEvents, loadRegion, saveRegion, updateEvent, deleteEvent } from './lib/storage';
import { startOfWeek } from './lib/dateUtils';
import { useTheme } from './lib/themeContext';
import { useAuth } from './lib/authContext';
import { canEditEvent, getEventsWithEditStatus } from './lib/permissions';

function App() {
  const { themeConfig } = useTheme();
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region>('All');
  const [view, setView] = useState<CalendarView>('month');
  const [cursor, setCursor] = useState<Date>(new Date());
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showSignUpModal, setShowSignUpModal] = useState<boolean>(false);
  const [showUserProfile, setShowUserProfile] = useState<boolean>(false);
  const [showMyEvents, setShowMyEvents] = useState<boolean>(false);
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

  // Apply user preferences
  useEffect(() => {
    if (user?.preferences) {
      // Set default view from user preferences
      if (user.preferences.defaultView) {
        setView(user.preferences.defaultView);
      }
      
      // Set default region from user preferences
      if (user.preferences.defaultRegion) {
        setSelectedRegion(user.preferences.defaultRegion);
      }
    }
  }, [user?.preferences]);

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
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    const eventWithUser: CalendarEvent = {
      ...newEvent,
      userId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setEvents(prev => [...prev, eventWithUser]);
    setShowEventForm(false); // Hide form after adding event
  };

  const handleUpdateEvent = async (updatedEvent: CalendarEvent) => {
    if (!user || !canEditEvent(updatedEvent, user.uid)) {
      console.error('User not authorized to edit this event');
      return;
    }
    
    try {
      const eventWithTimestamp = {
        ...updatedEvent,
        updatedAt: new Date()
      };
      await updateEvent(eventWithTimestamp);
      setEvents(prev => prev.map(event => 
        event.id === updatedEvent.id ? eventWithTimestamp : event
      ));
      setEditingEvent(null);
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event || !user || !canEditEvent(event, user.uid)) {
      console.error('User not authorized to delete this event');
      return;
    }
    
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
    if (!user || !canEditEvent(event, user.uid)) {
      console.error('User not authorized to edit this event');
      return;
    }
    setEditingEvent(event);
    setShowEventForm(true); // Show form when editing
  };

  const handleShowEventForm = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowEventForm(true);
    setEditingEvent(null); // Clear any editing state
  };

  const handleHideEventForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleShowMyEvents = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowMyEvents(true);
  };

  const handleHideMyEvents = () => {
    setShowMyEvents(false);
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

  // Filter events by selected region and add edit status
  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (selectedRegion !== 'All') {
      filtered = events.filter(e => e.region === selectedRegion);
    }
    return getEventsWithEditStatus(filtered, user?.uid || null);
  }, [events, selectedRegion, user]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return filteredEvents.filter(e => e.date === selectedDate);
  }, [filteredEvents, selectedDate]);

  // Get user's events for My Events view
  const userEvents = useMemo(() => {
    if (!user) return [];
    return events.filter(e => e.userId === user.uid);
  }, [events, user]);


  return (
    <div className="min-h-screen" style={{ backgroundColor: themeConfig.colors.background }}>
      <ThemeSync />
      {/* Dark Header */}
      <div className="bg-black text-white px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 pl-2">
              <BurgerMenu 
                currentView={view} 
                onViewChange={handleViewChange}
                isDarkMode={isDarkMode}
                onDarkModeToggle={handleDarkModeToggle}
                onShowEventForm={handleShowEventForm}
                onShowMyEvents={handleShowMyEvents}
                selectedRegion={selectedRegion}
                onRegionChange={handleRegionChange}
                onShowAuthModal={() => setShowAuthModal(true)}
                onShowSignUpModal={() => setShowSignUpModal(true)}
                onShowUserProfile={() => setShowUserProfile(true)}
              />
            </div>
            <div className="flex items-center gap-4 pr-2 pt-1">
              {/* Current Day Indicator */}
              <div className="w-8 h-8 border-2 border-white flex items-center justify-center text-white font-medium">
                {new Date().getDate()}
              </div>
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
        <div className="bg-black text-white mb-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 mobile:flex-col mobile:gap-4">
            <div className="flex items-center gap-2 mobile:order-2">
              <button 
                onClick={() => handleNavigate('prev')} 
                title="Previous"
                className="text-white hover:text-gray-300 transition-colors p-2"
              >
                ◀
              </button>
              <button 
                onClick={handleToday} 
                title="Today"
                className="text-white hover:text-gray-300 transition-colors px-3 py-1 border border-white rounded"
              >
                Today
              </button>
              <button 
                onClick={() => handleNavigate('next')} 
                title="Next"
                className="text-white hover:text-gray-300 transition-colors p-2"
              >
                ▶
              </button>
            </div>
            <div className="text-center mobile:order-1">
              <h2 className="text-2xl font-medium m-0 mobile:text-xl text-white">
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

        {/* Selected Day Details */}
        {selectedDate && (
          <div className="bg-black text-white mb-4">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-medium m-0 text-white">
                  {new Date(selectedDate).getDate()} {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()}
                </h2>
                <span className="text-white">😊</span>
              </div>
              <div className="space-y-2">
                {selectedDateEvents.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    No events for this date.
                  </div>
                ) : (
                  selectedDateEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ 
                        backgroundColor: themeConfig.colors.eventCard,
                        color: themeConfig.colors.eventCardText
                      }}
                    >
                      <div className="text-yellow-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">
                          {event.club}
                        </div>
                        <div className="text-sm text-gray-300">
                          All day
                        </div>
                      </div>
                      {event.canEdit && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="text-yellow-400 hover:text-yellow-300 text-sm"
                            title="Edit event"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                            title="Delete event"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Event Indicators */}
        <div className="bg-black text-white">
          <div className="p-4">
            <h2 className="text-lg font-medium m-0 mb-3 text-white">
              Event Indicators
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 text-sm">
                <span 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: themeConfig.colors.eventIndicator }}
                ></span>
                <span className="text-white">KZN Events</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: themeConfig.colors.eventIndicatorSecondary }}
                ></span>
                <span className="text-white">Gauteng Events</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span 
                  className="w-2 h-2 rounded-full flex items-center justify-center text-xs text-white font-semibold"
                  style={{ backgroundColor: themeConfig.colors.muted }}
                >+</span>
                <span className="text-white">Additional Events</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />

      {/* Sign Up Modal */}
      <AuthModal 
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        initialMode="signup"
      />

      {/* User Profile Modal */}
      <UserProfile 
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />

      {/* My Events Modal */}
      <MyEvents 
        events={userEvents}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        onClose={handleHideMyEvents}
        isOpen={showMyEvents}
      />
    </div>
  );
}

export default App;

