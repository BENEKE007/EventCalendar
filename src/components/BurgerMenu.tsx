import { useState } from 'react';
import { CalendarView } from '../types/event';
import { useTheme } from '../lib/themeContext';

interface BurgerMenuProps {
  currentView: CalendarView;
  onViewChange: (_view: CalendarView) => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  onShowEventForm: () => void;
  selectedRegion: string;
  onRegionChange: (_region: 'All' | 'KZN' | 'Gauteng') => void;
}

export default function BurgerMenu({ currentView, onViewChange, isDarkMode, onDarkModeToggle, onShowEventForm, selectedRegion, onRegionChange }: BurgerMenuProps) {
  const { currentTheme, setTheme, themeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showCalendarViews, setShowCalendarViews] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [showEventManagement, setShowEventManagement] = useState(false);
  const [showThemes, setShowThemes] = useState(false);

  const menuItems = [
    { id: 'year', label: 'Year', icon: '📅' },
    { id: 'month', label: 'Month', icon: '📅' },
    { id: 'week', label: 'Week', icon: '📅' },
    { id: 'day', label: 'Day', icon: '📅' },
    { id: 'schedule', label: 'Schedule', icon: '📋' },
    { id: 'reminders', label: 'Reminders', icon: '🔔' }
  ];

  const themes = [
    { id: 'android', label: 'Android Material', icon: '🤖' },
    { id: 'default', label: 'Default', icon: '💻' },
    { id: 'minimal', label: 'Minimal', icon: '⚪' }
  ] as const;

  const regionOptions = [
    { id: 'All', label: 'All Regions', icon: '🌍' },
    { id: 'KZN', label: 'KZN', icon: '🏖️' },
    { id: 'Gauteng', label: 'Gauteng', icon: '🏙️' }
  ];

  const handleMenuClick = (viewId: string) => {
    if (viewId === 'schedule' || viewId === 'reminders') {
      // These are placeholder items for now
    } else {
      onViewChange(viewId as CalendarView);
    }
    setIsOpen(false);
  };

  const handleDarkModeClick = () => {
    onDarkModeToggle();
    setIsOpen(false);
  };

  const handleThemeChange = (theme: 'android' | 'default' | 'minimal') => {
    setTheme(theme);
    setIsOpen(false);
  };

  const handleRegionChange = (region: 'All' | 'KZN' | 'Gauteng') => {
    onRegionChange(region);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      <button 
        className="p-2 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-opacity-20 mobile:min-h-12 mobile:min-w-12"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: themeConfig.colors.onPrimary,
          minWidth: '40px',
          height: '40px'
        }}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        aria-label="Toggle menu"
      >
        <div 
          className="w-6 h-6 flex flex-col justify-center items-center"
          style={{ gap: '4px' }}
        >
          <div 
            style={{ 
              width: '18px',
              height: '2px',
              backgroundColor: '#ffffff',
              borderRadius: '1px'
            }}
          ></div>
          <div 
            style={{ 
              width: '18px',
              height: '2px',
              backgroundColor: '#ffffff',
              borderRadius: '1px'
            }}
          ></div>
          <div 
            style={{ 
              width: '18px',
              height: '2px',
              backgroundColor: '#ffffff',
              borderRadius: '1px'
            }}
          ></div>
        </div>
      </button>
      
      {isOpen && (
        <div 
          className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-40" 
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="fixed top-0 left-0 w-70 h-screen border-r flex flex-col mobile:w-full mobile:max-w-sm" 
            style={{ 
              backgroundColor: themeConfig.colors.surface,
              borderColor: themeConfig.colors.outline
            }}
            onClick={(e) => e.stopPropagation()}
          >
          <div 
            className="flex justify-between items-center p-5 pb-4 border-b"
            style={{ borderColor: themeConfig.colors.outline }}
          >
            <h3 
              className="m-0 text-lg font-semibold"
              style={{ color: themeConfig.colors.onSurface }}
            >
              Settings
            </h3>
            <button 
              className="bg-none border-none text-2xl cursor-pointer p-1 rounded transition-all duration-200 hover:bg-opacity-10 mobile:min-h-12 mobile:min-w-12 mobile:text-3xl"
              style={{ 
                color: themeConfig.colors.muted,
                backgroundColor: 'transparent'
              }}
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              ×
            </button>
          </div>
          <nav className="flex-1 p-0 overflow-y-auto">
            {/* Main Menu */}
            <div className="p-3">
              <button
                className="flex items-center justify-between w-full p-2 bg-none border-none text-left cursor-pointer transition-all duration-200 text-sm rounded hover:bg-opacity-10 mobile:min-h-12 mobile:p-4"
                style={{ color: themeConfig.colors.onSurface }}
                onClick={() => {
                  setShowCalendarViews(!showCalendarViews);
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg w-5 text-center flex-shrink-0">📅</span>
                  <span className="font-medium">Calendar Views</span>
                </div>
                <span 
                  className="text-lg transition-transform duration-200"
                  style={{ 
                    transform: showCalendarViews ? 'rotate(90deg)' : 'rotate(0deg)',
                    color: themeConfig.colors.muted
                  }}
                >
                  ▶
                </span>
              </button>
              
              {/* Collapsible Calendar Views */}
              {showCalendarViews && (
                <div className="mt-2 space-y-1" style={{ paddingLeft: '2rem' }}>
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      className={`flex items-center gap-3 w-full p-2 bg-none border-none text-left cursor-pointer transition-all duration-200 text-sm rounded hover:bg-opacity-10 mobile:min-h-12 mobile:p-4 ${
                        currentView === item.id ? 'bg-opacity-20' : ''
                      }`}
                      style={{ 
                        color: currentView === item.id ? themeConfig.colors.primary : themeConfig.colors.onSurface,
                        backgroundColor: currentView === item.id ? `${themeConfig.colors.primary}20` : 'transparent'
                      }}
                      onClick={() => handleMenuClick(item.id)}
                    >
                      <span className="text-lg w-5 text-center flex-shrink-0">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="h-px mx-4 my-2" style={{ backgroundColor: themeConfig.colors.outline }}></div>
            
            {/* Event Management */}
            <div className="p-3">
              <button
                className="flex items-center justify-between w-full p-2 bg-none border-none text-left cursor-pointer transition-all duration-200 text-sm rounded hover:bg-opacity-10 mobile:min-h-12 mobile:p-4"
                style={{ color: themeConfig.colors.onSurface }}
                onClick={() => {
                  setShowEventManagement(!showEventManagement);
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg w-5 text-center flex-shrink-0">📝</span>
                  <span className="font-medium">Event Management</span>
                </div>
                <span 
                  className="text-lg transition-transform duration-200"
                  style={{ 
                    transform: showEventManagement ? 'rotate(90deg)' : 'rotate(0deg)',
                    color: themeConfig.colors.muted
                  }}
                >
                  ▶
                </span>
              </button>
              
              {/* Collapsible Event Management */}
              {showEventManagement && (
                <div className="mt-2 space-y-1" style={{ paddingLeft: '2rem' }}>
                  <button
                    className="flex items-center gap-3 w-full p-2 bg-none border-none text-left cursor-pointer transition-all duration-200 text-sm rounded hover:bg-opacity-10 mobile:min-h-12 mobile:p-4"
                    style={{ color: themeConfig.colors.onSurface }}
                    onClick={() => {
                      onShowEventForm();
                      setIsOpen(false);
                    }}
                  >
                    <span className="text-lg w-5 text-center flex-shrink-0">➕</span>
                    <span className="font-medium">Add Event</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="h-px mx-4 my-2" style={{ backgroundColor: themeConfig.colors.outline }}></div>
            
            {/* Filter Options */}
            <div className="p-3">
              <button
                className="flex items-center justify-between w-full p-2 bg-none border-none text-left cursor-pointer transition-all duration-200 text-sm rounded hover:bg-opacity-10 mobile:min-h-12 mobile:p-4"
                style={{ color: themeConfig.colors.onSurface }}
                onClick={() => {
                  setShowFilterOptions(!showFilterOptions);
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg w-5 text-center flex-shrink-0">🔍</span>
                  <span className="font-medium">Filter Options</span>
                </div>
                <span 
                  className="text-lg transition-transform duration-200"
                  style={{ 
                    transform: showFilterOptions ? 'rotate(90deg)' : 'rotate(0deg)',
                    color: themeConfig.colors.muted
                  }}
                >
                  ▶
                </span>
              </button>
              
              {/* Collapsible Filter Options */}
              {showFilterOptions && (
                <div className="mt-2 space-y-1" style={{ paddingLeft: '2rem' }}>
                  {regionOptions.map((region) => (
                    <button
                      key={region.id}
                      className={`flex items-center gap-3 w-full p-2 bg-none border-none text-left cursor-pointer transition-all duration-200 text-sm rounded hover:bg-opacity-10 mobile:min-h-12 mobile:p-4 ${
                        selectedRegion === region.id ? 'bg-opacity-20' : ''
                      }`}
                      style={{ 
                        color: selectedRegion === region.id ? themeConfig.colors.primary : themeConfig.colors.onSurface,
                        backgroundColor: selectedRegion === region.id ? `${themeConfig.colors.primary}20` : 'transparent'
                      }}
                      onClick={() => handleRegionChange(region.id as 'All' | 'KZN' | 'Gauteng')}
                    >
                      <span className="text-lg w-5 text-center flex-shrink-0">{region.icon}</span>
                      <span className="font-medium">{region.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="h-px mx-4 my-2" style={{ backgroundColor: themeConfig.colors.outline }}></div>
            
            {/* Themes */}
            <div className="p-3">
              <button
                className="flex items-center justify-between w-full p-2 bg-none border-none text-left cursor-pointer transition-all duration-200 text-sm rounded hover:bg-opacity-10 mobile:min-h-12 mobile:p-4"
                style={{ color: themeConfig.colors.onSurface }}
                onClick={() => {
                  setShowThemes(!showThemes);
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg w-5 text-center flex-shrink-0">🎨</span>
                  <span className="font-medium">Themes</span>
                </div>
                <span 
                  className="text-lg transition-transform duration-200"
                  style={{ 
                    transform: showThemes ? 'rotate(90deg)' : 'rotate(0deg)',
                    color: themeConfig.colors.muted
                  }}
                >
                  ▶
                </span>
              </button>
              
              {/* Collapsible Themes */}
              {showThemes && (
                <div className="mt-2 space-y-1" style={{ paddingLeft: '2rem' }}>
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      className={`flex items-center gap-3 w-full p-2 bg-none border-none text-left cursor-pointer transition-all duration-200 text-sm rounded hover:bg-opacity-10 mobile:min-h-12 mobile:p-4 ${
                        currentTheme === theme.id ? 'bg-opacity-20' : ''
                      }`}
                      style={{ 
                        color: currentTheme === theme.id ? themeConfig.colors.primary : themeConfig.colors.onSurface,
                        backgroundColor: currentTheme === theme.id ? `${themeConfig.colors.primary}20` : 'transparent'
                      }}
                      onClick={() => handleThemeChange(theme.id)}
                    >
                      <span className="text-lg w-5 text-center flex-shrink-0">{theme.icon}</span>
                      <span className="font-medium">{theme.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="h-px mx-4 my-2" style={{ backgroundColor: themeConfig.colors.outline }}></div>
            
            {/* Dark Mode */}
            <div className="p-3">
              <button
                className="flex items-center gap-3 w-full p-2 bg-none border-none text-left cursor-pointer transition-all duration-200 text-sm rounded hover:bg-opacity-10 relative mobile:min-h-12 mobile:p-4"
                style={{ color: themeConfig.colors.onSurface }}
                onClick={handleDarkModeClick}
              >
                <span className="text-lg w-5 text-center flex-shrink-0">{isDarkMode ? '🌙' : '☀️'}</span>
                <span className="font-medium">Dark Mode</span>
                <span 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-5 rounded-full transition-colors duration-300"
                  style={{ 
                    backgroundColor: isDarkMode ? themeConfig.colors.primary : themeConfig.colors.outline
                  }}
                >
                  <span 
                    className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md"
                    style={{ 
                      left: isDarkMode ? '1.25rem' : '0.125rem'
                    }}
                  ></span>
                </span>
              </button>
            </div>
          </nav>
          </div>
        </div>
      )}
    </div>
  );
}
