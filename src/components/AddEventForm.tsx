import React, { useState } from 'react';
import { CalendarEvent } from '../types/event';
import { toYMD } from '../lib/dateUtils';

interface AddEventFormProps {
  onAdd: (event: CalendarEvent) => void;
}

export default function AddEventForm({ onAdd }: AddEventFormProps) {
  const [club, setClub] = useState('');
  const [date, setDate] = useState(toYMD(new Date()));
  const [region, setRegion] = useState<'KZN' | 'Gauteng'>('KZN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!club.trim() || !date) return;
    
    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      club: club.trim(),
      date,
      region,
    };
    
    onAdd(newEvent);
    setClub('');
    setDate(toYMD(new Date()));
  };

  return (
    <div className="card" style={{ marginBottom: '12px' }}>
      <form onSubmit={handleSubmit} className="row" autoComplete="off">
        <div className="col">
          <label htmlFor="club" className="subtle">Club</label><br />
          <input
            id="club"
            name="club"
            type="text"
            placeholder="Club name"
            value={club}
            onChange={(e) => setClub(e.target.value)}
          />
        </div>
        <div className="col" style={{ maxWidth: '220px' }}>
          <label htmlFor="region" className="subtle">Region</label><br />
          <select
            id="region"
            name="region"
            value={region}
            onChange={(e) => setRegion(e.target.value as 'KZN' | 'Gauteng')}
          >
            <option value="KZN">KZN</option>
            <option value="Gauteng">Gauteng</option>
          </select>
        </div>
        <div className="col" style={{ maxWidth: '220px' }}>
          <label htmlFor="date" className="subtle">Date</label><br />
          <input
            id="date"
            name="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="col" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-end' }}>
          <button type="submit" style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px' }}>
            Add Event
          </button>
        </div>
      </form>
    </div>
  );
}


