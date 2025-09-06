import { useMemo } from 'react';
import { CalendarView, CalendarEvent } from '../types/event';
import { startOfWeek, toYMD, isToday, isSameMonth } from '../lib/dateUtils';
import DayCell from './DayCell';

interface CalendarProps {
  view: CalendarView;
  cursor: Date;
  events: CalendarEvent[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

export default function Calendar({ view, cursor, events, selectedDate, onDateSelect }: CalendarProps) {
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

    return (
      <div className="grid grid-7">
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

    return (
      <div className="grid grid-7">
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
        <div key={month} className="card">
          <div className="month-title">
            {firstDay.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
          </div>
          <div className="grid grid-7">
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
      <div className="year-grid">
        {months}
      </div>
    );
  };

  return (
    <div className="calendar-root">
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'year' && renderYearView()}
    </div>
  );
}
