import { useMemo } from 'react';
import { CalendarView, CalendarEvent } from '../types/event';
import { startOfWeek, toYMD, isToday, isSameMonth } from '../lib/dateUtils';
import { useTheme } from '../lib/themeContext';
import DayCell from './DayCell';

interface CalendarProps {
  view: CalendarView;
  cursor: Date;
  events: CalendarEvent[];
  selectedDate: string | null;
  onDateSelect: (_date: string) => void;
}

export default function Calendar({ view, cursor, events, selectedDate, onDateSelect }: CalendarProps) {
  const { themeConfig } = useTheme();
  
  // Group events by date for efficient lookup
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach(event => {
      const existing = map.get(event.date) || [];
      map.set(event.date, [...existing, event]);
    });
    return map;
  }, [events]);

  const renderMonthView = () => {
    const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startDate = startOfWeek(firstDay);
    
    const days = [];
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayHeaders.map((day) => (
            <div 
              key={day} 
              className="text-center py-2 text-sm font-medium mobile:text-xs mobile:py-1"
              style={{ color: themeConfig.colors.muted }}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 mobile:gap-0.5">
          {days.map((date, index) => (
            <DayCell
              key={index}
              date={date}
              events={eventsByDate.get(toYMD(date)) || []}
              isToday={isToday(date)}
              isSelected={selectedDate === toYMD(date)}
              isMuted={!isSameMonth(date, cursor)}
              onClick={() => onDateSelect(toYMD(date))}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startDate = startOfWeek(cursor);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayHeaders.map((day) => (
            <div 
              key={day} 
              className="text-center py-2 text-sm font-medium mobile:text-xs mobile:py-1"
              style={{ color: themeConfig.colors.muted }}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 mobile:gap-0.5">
          {days.map((date, index) => (
            <DayCell
              key={index}
              date={date}
              events={eventsByDate.get(toYMD(date)) || []}
              isToday={isToday(date)}
              isSelected={selectedDate === toYMD(date)}
              isMuted={false}
              onClick={() => onDateSelect(toYMD(date))}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const day = cursor;
    const events = eventsByDate.get(toYMD(day)) || [];

    return (
      <div className="p-4">
        <div className="mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="m-0 text-2xl text-gray-900 dark:text-gray-100">
            {day.toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {events.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 italic py-10 px-5">No events scheduled for this day</div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-gray-600">
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium min-w-15">All Day</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-gray-100 mb-0.5">{event.club}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{event.region}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const months = [];
    for (let month = 0; month < 12; month++) {
      const firstDay = new Date(cursor.getFullYear(), month, 1);
      const startDate = startOfWeek(firstDay);
      
      const days = [];
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        days.push(date);
      }

      months.push(
        <div key={month} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="font-semibold my-1.5 mb-2">
            {firstDay.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((date, dayIndex) => (
              <DayCell
                key={dayIndex}
                date={date}
                events={eventsByDate.get(toYMD(date)) || []}
                isToday={isToday(date)}
                isSelected={selectedDate === toYMD(date)}
                isMuted={!isSameMonth(date, firstDay)}
                isCompact={true}
                onClick={() => onDateSelect(toYMD(date))}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-1">
        {months}
      </div>
    );
  };

  return (
    <div className="min-h-50">
      {view === 'day' && renderDayView()}
      {view === 'week' && renderWeekView()}
      {view === 'month' && renderMonthView()}
      {view === 'year' && renderYearView()}
    </div>
  );
}
