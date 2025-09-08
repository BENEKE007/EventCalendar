import { useState } from 'react';
import { CalendarView } from '../types/event';
import { useTheme } from '../lib/themeContext';
import { useAuth } from '../lib/authContext';

interface BurgerMenuProps {
  currentView: CalendarView;
  onViewChange: (_view: CalendarView) => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  onShowEventForm: () => void;
  onShowMyEvents: () => void;
  selectedRegion: string;
  onRegionChange: (_region: 'All' | 'KZN' | 'Gauteng') => void;
  onShowAuthModal: () => void;
  onShowSignUpModal: () => void;
  onShowUserProfile: () => void;
}

export default function BurgerMenu({ currentView, onViewChange, isDarkMode, onDarkModeToggle, onShowEventForm, onShowMyEvents, selectedRegion, onRegionChange, onShowAuthModal, onShowSignUpModal, onShowUserProfile }: BurgerMenuProps) {
  const { currentTheme, setTheme, themeConfig } = useTheme();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showCalendarViews, setShowCalendarViews] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [showEventManagement, setShowEventManagement] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showAuthOptions, setShowAuthOptions] = useState(false);

  const menuItems = [
    { id: 'year', label: 'Year', icon: '📅' },
    { id: 'month', label: 'Month', icon: '📅' },
    { id: 'week', label: 'Week', icon: '📅' },
    { id: 'day', label: 'Day', icon: '📅' }
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
    onViewChange(viewId as CalendarView);
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
          className="fixed top-0 left-0 right-0 bottom-0 bg-black/60 z-40" 
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="fixed top-0 left-0 w-80 h-screen flex flex-col mobile:w-full mobile:max-w-sm" 
            style={{ 
              backgroundColor: themeConfig.colors.surface,
              boxShadow: '2px 0 8px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
          <div 
            className="flex justify-between items-center px-6 py-4"
            style={{ 
              borderBottom: `1px solid ${themeConfig.colors.outline}`,
              backgroundColor: themeConfig.colors.surface
            }}
          >
            <h3 
              className="m-0 text-xl font-medium"
              style={{ color: themeConfig.colors.onSurface }}
            >
              Menu
            </h3>
            <button 
              className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10"
              style={{ 
                color: themeConfig.colors.onSurface,
                backgroundColor: 'transparent'
              }}
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <nav className="flex-1 p-0 overflow-y-auto" style={{ backgroundColor: themeConfig.colors.surface }}>
            {/* Calendar Views Section */}
            <div className="px-4 py-2">
              <button
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 text-left cursor-pointer hover:bg-white/10"
                style={{ 
                  color: themeConfig.colors.onSurface,
                  backgroundColor: 'transparent'
                }}
                onClick={() => {
                  setShowCalendarViews(!showCalendarViews);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17a2 2 0 01-2 2H5a2 2 0 01-2-2V8.5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-medium text-base">Calendar Views</span>
                </div>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  className="transition-transform duration-200"
                  style={{ 
                    transform: showCalendarViews ? 'rotate(90deg)' : 'rotate(0deg)',
                    color: themeConfig.colors.muted
                  }}
                >
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {/* Collapsible Calendar Views */}
              {showCalendarViews && (
                <div className="mt-1 space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      className={`flex items-center gap-4 w-full py-3 rounded-lg text-left cursor-pointer transition-all duration-200 ${
                        currentView === item.id ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                      style={{ 
                        color: currentView === item.id ? themeConfig.colors.primary : themeConfig.colors.onSurface,
                        backgroundColor: currentView === item.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        paddingLeft: '48px',
                        paddingRight: '16px'
                      }}
                      onClick={() => handleMenuClick(item.id)}
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17a2 2 0 01-2 2H5a2 2 0 01-2-2V8.5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="font-medium text-sm">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mx-4 my-2 h-px" style={{ backgroundColor: themeConfig.colors.outline }}></div>
            
            {/* Event Management */}
            <div className="px-4 py-2">
              <button
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 text-left cursor-pointer hover:bg-white/10"
                style={{ 
                  color: themeConfig.colors.onSurface,
                  backgroundColor: 'transparent'
                }}
                onClick={() => {
                  setShowEventManagement(!showEventManagement);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-medium text-base">Event Management</span>
                </div>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  className="transition-transform duration-200"
                  style={{ 
                    transform: showEventManagement ? 'rotate(90deg)' : 'rotate(0deg)',
                    color: themeConfig.colors.muted
                  }}
                >
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {/* Collapsible Event Management */}
              {showEventManagement && (
                <div className="mt-1 space-y-1">
                  <button
                    className="flex items-center gap-4 w-full py-3 rounded-lg text-left cursor-pointer transition-all duration-200 hover:bg-white/10"
                    style={{ 
                      color: themeConfig.colors.onSurface,
                      backgroundColor: 'transparent',
                      paddingLeft: '48px',
                      paddingRight: '16px'
                    }}
                    onClick={() => {
                      onShowEventForm();
                      setIsOpen(false);
                    }}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="font-medium text-sm">Add Event</span>
                  </button>
                  <button
                    className="flex items-center gap-4 w-full py-3 rounded-lg text-left cursor-pointer transition-all duration-200 hover:bg-white/10"
                    style={{ 
                      color: themeConfig.colors.onSurface,
                      backgroundColor: 'transparent',
                      paddingLeft: '48px',
                      paddingRight: '16px'
                    }}
                    onClick={() => {
                      onShowMyEvents();
                      setIsOpen(false);
                    }}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="font-medium text-sm">My Events</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="mx-4 my-2 h-px" style={{ backgroundColor: themeConfig.colors.outline }}></div>
            
            {/* Authentication */}
            <div className="px-4 py-2">
              <button
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 text-left cursor-pointer hover:bg-white/10"
                style={{ 
                  color: themeConfig.colors.onSurface,
                  backgroundColor: 'transparent'
                }}
                onClick={() => {
                  setShowAuthOptions(!showAuthOptions);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {user ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="font-medium text-base">{user ? 'Account' : 'Authentication'}</span>
                </div>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  className="transition-transform duration-200"
                  style={{ 
                    transform: showAuthOptions ? 'rotate(90deg)' : 'rotate(0deg)',
                    color: themeConfig.colors.muted
                  }}
                >
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {/* Collapsible Authentication Options */}
              {showAuthOptions && (
                <div className="mt-1 space-y-1">
                  {user ? (
                    <>
                      <button
                        className="flex items-center gap-4 w-full py-3 rounded-lg text-left cursor-pointer transition-all duration-200 hover:bg-white/10"
                        style={{ 
                          color: themeConfig.colors.onSurface,
                          backgroundColor: 'transparent',
                          paddingLeft: '48px',
                          paddingRight: '16px'
                        }}
                        onClick={() => {
                          onShowUserProfile();
                          setIsOpen(false);
                        }}
                      >
                        <div className="w-5 h-5 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="font-medium text-sm">Profile</span>
                      </button>
                      <button
                        className="flex items-center gap-4 w-full py-3 rounded-lg text-left cursor-pointer transition-all duration-200 hover:bg-white/10"
                        style={{ 
                          color: themeConfig.colors.onSurface,
                          backgroundColor: 'transparent',
                          paddingLeft: '48px',
                          paddingRight: '16px'
                        }}
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                      >
                        <div className="w-5 h-5 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="font-medium text-sm">Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="flex items-center gap-4 w-full py-3 rounded-lg text-left cursor-pointer transition-all duration-200 hover:bg-white/10"
                        style={{ 
                          color: themeConfig.colors.onSurface,
                          backgroundColor: 'transparent',
                          paddingLeft: '48px',
                          paddingRight: '16px'
                        }}
                        onClick={() => {
                          onShowAuthModal();
                          setIsOpen(false);
                        }}
                      >
                        <div className="w-5 h-5 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="font-medium text-sm">Sign In</span>
                      </button>
                      <button
                        className="flex items-center gap-4 w-full py-3 rounded-lg text-left cursor-pointer transition-all duration-200 hover:bg-white/10"
                        style={{ 
                          color: themeConfig.colors.onSurface,
                          backgroundColor: 'transparent',
                          paddingLeft: '48px',
                          paddingRight: '16px'
                        }}
                        onClick={() => {
                          onShowSignUpModal();
                          setIsOpen(false);
                        }}
                      >
                        <div className="w-5 h-5 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12.5 7a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="font-medium text-sm">Sign Up</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="mx-4 my-2 h-px" style={{ backgroundColor: themeConfig.colors.outline }}></div>
            
            {/* Filter Options */}
            <div className="px-4 py-2">
              <button
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 text-left cursor-pointer hover:bg-white/10"
                style={{ 
                  color: themeConfig.colors.onSurface,
                  backgroundColor: 'transparent'
                }}
                onClick={() => {
                  setShowFilterOptions(!showFilterOptions);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-medium text-base">Filter Options</span>
                </div>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  className="transition-transform duration-200"
                  style={{ 
                    transform: showFilterOptions ? 'rotate(90deg)' : 'rotate(0deg)',
                    color: themeConfig.colors.muted
                  }}
                >
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {/* Collapsible Filter Options */}
              {showFilterOptions && (
                <div className="mt-1 space-y-1">
                  {regionOptions.map((region) => (
                    <button
                      key={region.id}
                      className={`flex items-center gap-4 w-full py-3 rounded-lg text-left cursor-pointer transition-all duration-200 ${
                        selectedRegion === region.id ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                      style={{ 
                        color: selectedRegion === region.id ? themeConfig.colors.primary : themeConfig.colors.onSurface,
                        backgroundColor: selectedRegion === region.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        paddingLeft: '48px',
                        paddingRight: '16px'
                      }}
                      onClick={() => handleRegionChange(region.id as 'All' | 'KZN' | 'Gauteng')}
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 7a3 3 0 100 6 3 3 0 000-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="font-medium text-sm">{region.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mx-4 my-2 h-px" style={{ backgroundColor: themeConfig.colors.outline }}></div>
            
            {/* Themes */}
            <div className="px-4 py-2">
              <button
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 text-left cursor-pointer hover:bg-white/10"
                style={{ 
                  color: themeConfig.colors.onSurface,
                  backgroundColor: 'transparent'
                }}
                onClick={() => {
                  setShowThemes(!showThemes);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-medium text-base">Themes</span>
                </div>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  className="transition-transform duration-200"
                  style={{ 
                    transform: showThemes ? 'rotate(90deg)' : 'rotate(0deg)',
                    color: themeConfig.colors.muted
                  }}
                >
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {/* Collapsible Themes */}
              {showThemes && (
                <div className="mt-1 space-y-1">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      className={`flex items-center gap-4 w-full py-3 rounded-lg text-left cursor-pointer transition-all duration-200 ${
                        currentTheme === theme.id ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                      style={{ 
                        color: currentTheme === theme.id ? themeConfig.colors.primary : themeConfig.colors.onSurface,
                        backgroundColor: currentTheme === theme.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        paddingLeft: '48px',
                        paddingRight: '16px'
                      }}
                      onClick={() => handleThemeChange(theme.id)}
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentTheme === theme.id ? themeConfig.colors.primary : themeConfig.colors.muted }}></div>
                      </div>
                      <span className="font-medium text-sm">{theme.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mx-4 my-2 h-px" style={{ backgroundColor: themeConfig.colors.outline }}></div>
            
            {/* Dark Mode */}
            <div className="px-4 py-2">
              <button
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 text-left cursor-pointer hover:bg-white/10"
                style={{ 
                  color: themeConfig.colors.onSurface,
                  backgroundColor: 'transparent'
                }}
                onClick={handleDarkModeClick}
              >
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      {isDarkMode ? (
                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      ) : (
                        <path d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      )}
                    </svg>
                  </div>
                  <span className="font-medium text-base">Dark Mode</span>
                </div>
                <div 
                  className="w-12 h-6 rounded-full transition-colors duration-300 flex items-center"
                  style={{ 
                    backgroundColor: isDarkMode ? themeConfig.colors.primary : themeConfig.colors.outline
                  }}
                >
                  <div 
                    className="w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm"
                    style={{ 
                      transform: isDarkMode ? 'translateX(6px)' : 'translateX(1px)'
                    }}
                  ></div>
                </div>
              </button>
            </div>
          </nav>
          </div>
        </div>
      )}
    </div>
  );
}
