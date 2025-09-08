import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../types/event';
import { toYMD } from '../lib/dateUtils';
import { useTheme } from '../lib/themeContext';

interface EventFormProps {
  onAdd: (_event: CalendarEvent) => void;
  onUpdate?: (_event: CalendarEvent) => void;
  editingEvent?: CalendarEvent | null;
  onCancel?: () => void;
}

export default function EventForm({ onAdd, onUpdate, editingEvent, onCancel }: EventFormProps) {
  const { themeConfig } = useTheme();
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
        updatedAt: new Date()
      };
      onUpdate(updatedEvent);
    } else {
      // Add new event
      const newEvent: CalendarEvent = {
        id: crypto.randomUUID(),
        club: club.trim(),
        date,
        region,
        userId: '', // Will be set by App component
        createdAt: new Date(),
        updatedAt: new Date()
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
    <div className="android-card mb-4">
      <div className="p-4">
        <h3 className="m-0 mb-4 text-lg font-medium" style={{ color: themeConfig.colors.onSurface }}>
          {editingEvent ? 'Edit Event' : 'Add Event'}
        </h3>
        <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap items-end mobile:flex-col mobile:gap-4" autoComplete="off">
          <div className="flex-1 min-w-0 mobile:w-full">
            <label 
              htmlFor="club" 
              className="block text-sm font-medium mb-2"
              style={{ color: themeConfig.colors.onSurface }}
            >
              Club
            </label>
            <input
              id="club"
              name="club"
              type="text"
              placeholder="Club name"
              value={club}
              onChange={(e) => setClub(e.target.value)}
              className="android-input w-full"
              style={{ 
                backgroundColor: themeConfig.colors.surface,
                borderColor: themeConfig.colors.outline,
                color: themeConfig.colors.onSurface,
                fontFamily: themeConfig.typography.fontFamily,
              }}
            />
          </div>
          <div className="w-32 mobile:w-full">
            <label 
              htmlFor="region" 
              className="block text-sm font-medium mb-2"
              style={{ color: themeConfig.colors.onSurface }}
            >
              Region
            </label>
            <select
              id="region"
              name="region"
              value={region}
              onChange={(e) => setRegion(e.target.value as 'KZN' | 'Gauteng')}
              className="android-input w-full"
              style={{ 
                backgroundColor: themeConfig.colors.surface,
                borderColor: themeConfig.colors.outline,
                color: themeConfig.colors.onSurface,
                fontFamily: themeConfig.typography.fontFamily,
              }}
            >
              <option value="KZN">KZN</option>
              <option value="Gauteng">Gauteng</option>
            </select>
          </div>
          <div className="w-40 mobile:w-full">
            <label 
              htmlFor="date" 
              className="block text-sm font-medium mb-2"
              style={{ color: themeConfig.colors.onSurface }}
            >
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="android-input w-full"
              style={{ 
                backgroundColor: themeConfig.colors.surface,
                borderColor: themeConfig.colors.outline,
                color: themeConfig.colors.onSurface,
                fontFamily: themeConfig.typography.fontFamily,
              }}
            />
          </div>
          <div className="flex gap-2 mobile:w-full mobile:flex-col mobile:gap-2">
            <button 
              type="submit" 
              className="android-button mobile:w-full"
              style={{ 
                backgroundColor: themeConfig.colors.primary,
                color: themeConfig.colors.onPrimary,
                fontFamily: themeConfig.typography.fontFamily,
                fontWeight: themeConfig.typography.fontWeight.medium,
              }}
            >
              {editingEvent ? 'Update Event' : 'Add Event'}
            </button>
            {onCancel && (
              <button 
                type="button" 
                onClick={handleCancel}
                className="android-button-outlined mobile:w-full"
                style={{ 
                  color: themeConfig.colors.primary,
                  borderColor: themeConfig.colors.primary,
                  fontFamily: themeConfig.typography.fontFamily,
                  fontWeight: themeConfig.typography.fontWeight.medium,
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}


