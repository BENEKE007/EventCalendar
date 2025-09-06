import { useState } from 'react';
import { CalendarView } from '../types/event';

interface BurgerMenuProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

export default function BurgerMenu({ currentView, onViewChange, isDarkMode, onDarkModeToggle }: BurgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'year', label: 'Year', icon: '📅' },
    { id: 'month', label: 'Month', icon: '📅' },
    { id: 'week', label: 'Week', icon: '📅' },
    { id: 'day', label: 'Day', icon: '📅' },
    { id: 'schedule', label: 'Schedule', icon: '📋' },
    { id: 'reminders', label: 'Reminders', icon: '🔔' }
  ];

  const handleMenuClick = (viewId: string) => {
    if (viewId === 'schedule' || viewId === 'reminders') {
      // These are placeholder items for now
      console.log(`${viewId} clicked`);
    } else {
      onViewChange(viewId as CalendarView);
    }
    setIsOpen(false);
  };

  const handleDarkModeClick = () => {
    onDarkModeToggle();
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      <button 
        className="bg-black/15 dark:bg-white/10 border-2 border-black/30 dark:border-white/20 cursor-pointer p-2.5 flex items-center justify-center rounded-lg transition-all duration-200 shadow-md hover:bg-black/25 dark:hover:bg-white/20 hover:border-black/40 dark:hover:border-white/30 hover:shadow-lg hover:-translate-y-px"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <div className="flex flex-col gap-0.5 w-5 h-4">
          <span className="block h-1 w-full bg-gray-800 dark:bg-white rounded-sm transition-all duration-300 shadow-sm"></span>
          <span className="block h-1 w-full bg-gray-800 dark:bg-white rounded-sm transition-all duration-300 shadow-sm"></span>
          <span className="block h-1 w-full bg-gray-800 dark:bg-white rounded-sm transition-all duration-300 shadow-sm"></span>
        </div>
      </button>
      
      <div className={`fixed top-0 left-0 right-0 bottom-0 bg-black/50 opacity-0 invisible transition-all duration-300 z-40 ${isOpen ? 'opacity-100 visible' : ''}`} onClick={() => setIsOpen(false)}>
        <div className={`fixed top-0 left-0 w-70 h-screen bg-slate-800 dark:bg-slate-900 border-r border-slate-600 dark:border-slate-700 -translate-x-full transition-transform duration-300 z-50 flex flex-col ${isOpen ? 'translate-x-0' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center p-5 pb-4 border-b border-slate-600 dark:border-slate-700">
            <h3 className="m-0 text-white text-lg font-semibold">Calendar Views</h3>
            <button 
              className="bg-none border-none text-slate-400 dark:text-slate-300 text-2xl cursor-pointer p-1 rounded transition-all duration-200 hover:text-white hover:bg-white/10"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              ×
            </button>
          </div>
          <nav className="flex-1 p-0 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`flex items-center gap-3 w-full p-3 bg-none border-none text-slate-200 dark:text-slate-300 text-left cursor-pointer transition-all duration-200 text-sm hover:bg-white/5 hover:text-white ${currentView === item.id ? 'bg-blue-500/20 text-blue-300 dark:text-blue-400 border-r-3 border-r-blue-500' : ''}`}
                onClick={() => handleMenuClick(item.id)}
              >
                <span className="text-lg w-5 text-center flex-shrink-0">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            <div className="h-px bg-slate-600 dark:bg-slate-700 mx-4 my-2"></div>
            <button
              className="flex items-center gap-3 w-full p-3 bg-none border-none text-slate-200 dark:text-slate-300 text-left cursor-pointer transition-all duration-200 text-sm hover:bg-white/5 hover:text-white relative"
              onClick={handleDarkModeClick}
            >
              <span className="text-lg w-5 text-center flex-shrink-0">{isDarkMode ? '🌙' : '☀️'}</span>
              <span className="font-medium">Dark Mode</span>
              <span className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-5 bg-slate-600 dark:bg-slate-700 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-blue-500' : ''}`}>
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md ${isDarkMode ? 'translate-x-5' : ''}`}></span>
              </span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
