import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../types/event';
import { toYMD } from '../lib/dateUtils';

interface EventFormProps {
  onAdd: (event: CalendarEvent) => void;
  onUpdate?: (event: CalendarEvent) => void;
  editingEvent?: CalendarEvent | null;
  onCancel?: () => void;
}

export default function EventForm({ onAdd, onUpdate, editingEvent, onCancel }: EventFormProps) {
  const [club, setClub] = useState('');
  const [date, setDate] = useState(toYMD(new Date()));
  const [region, setRegion] = useState<'KZN' | 'Gauteng'>('KZN');

  // Update form when editing event changes
  useEffect(() => {
    if (editingEvent) {
      setClub(editingEvent.club);
      setDate(editingEvent.date);
      setRegion(editingEvent.region);
    } else {
      setClub('');
      setDate(toYMD(new Date()));
      setRegion('KZN');
    }
  }, [editingEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!club.trim() || !date) return;
    
    if (editingEvent && onUpdate) {
      // Update existing event
      const updatedEvent: CalendarEvent = {
        ...editingEvent,
        club: club.trim(),
        date,
        region,
      };
      onUpdate(updatedEvent);
    } else {
      // Add new event
      const newEvent: CalendarEvent = {
        id: crypto.randomUUID(),
        club: club.trim(),
        date,
        region,
      };
      onAdd(newEvent);
    }
    
    // Reset form
    setClub('');
    setDate(toYMD(new Date()));
    setRegion('KZN');
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setClub('');
    setDate(toYMD(new Date()));
    setRegion('KZN');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-3">
      <h3 className="m-0 mb-3 text-base">
        {editingEvent ? 'Edit Event' : 'Add Event'}
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-2.5 flex-wrap" autoComplete="off">
        <div className="flex-1 min-w-0">
          <label htmlFor="club" className="text-gray-500 dark:text-gray-400 text-sm">Club</label><br />
          <input
            id="club"
            name="club"
            type="text"
            placeholder="Club name"
            value={club}
            onChange={(e) => setClub(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-2 bg-white dark:bg-slate-900 text-inherit"
          />
        </div>
        <div className="max-w-56">
          <label htmlFor="region" className="text-gray-500 dark:text-gray-400 text-sm">Region</label><br />
          <select
            id="region"
            name="region"
            value={region}
            onChange={(e) => setRegion(e.target.value as 'KZN' | 'Gauteng')}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-2 bg-white dark:bg-slate-900 text-inherit"
          >
            <option value="KZN">KZN</option>
            <option value="Gauteng">Gauteng</option>
          </select>
        </div>
        <div className="max-w-56">
          <label htmlFor="date" className="text-gray-500 dark:text-gray-400 text-sm">Date</label><br />
          <input
            id="date"
            name="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-2 bg-white dark:bg-slate-900 text-inherit"
          />
        </div>
        <div className="flex-none flex items-end gap-2">
          <button 
            type="submit" 
            className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 active:bg-gray-100 dark:active:bg-slate-700 active:translate-y-px"
          >
            {editingEvent ? 'Update Event' : 'Add Event'}
          </button>
          {editingEvent && onCancel && (
            <button 
              type="button" 
              onClick={handleCancel}
              className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}


