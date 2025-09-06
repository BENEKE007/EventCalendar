import { CalendarEvent, Region } from '../types/event';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';

const EVENTS_COLLECTION = 'events';
const SETTINGS_COLLECTION = 'settings';

// Fallback to localStorage for offline support
const STORAGE_KEY = 'event_calendar_events_v1';
const REGION_KEY = 'event_calendar_region_v1';

export async function loadEvents(): Promise<CalendarEvent[]> {
  try {
    // Try to load from Firebase first
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const q = query(eventsRef, orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const events: CalendarEvent[] = [];
      querySnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() } as CalendarEvent);
      });
      return events;
    }
  } catch (error) {
    console.warn('Failed to load events from Firebase, falling back to localStorage:', error);
  }
  
  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const events = JSON.parse(raw) as CalendarEvent[];
    return Array.isArray(events) ? events : [];
  } catch {
    return [];
  }
}

export async function saveEvents(events: CalendarEvent[]): Promise<void> {
  try {
    // Save to Firebase
    const eventsRef = collection(db, EVENTS_COLLECTION);
    
    // Get existing events to compare
    const existingSnapshot = await getDocs(eventsRef);
    const existingIds = new Set(existingSnapshot.docs.map(doc => doc.id));
    
    // Delete events that are no longer in the array
    for (const docSnapshot of existingSnapshot.docs) {
      if (!events.find(event => event.id === docSnapshot.id)) {
        await deleteDoc(doc(db, EVENTS_COLLECTION, docSnapshot.id));
      }
    }
    
    // Add or update events
    for (const event of events) {
      const eventData = { ...event };
      const { id, ...eventDataWithoutId } = eventData; // Remove id from data as it's the document ID
      
      if (existingIds.has(event.id)) {
        // Update existing event
        await setDoc(doc(db, EVENTS_COLLECTION, event.id), eventDataWithoutId);
      } else {
        // Add new event
        await addDoc(eventsRef, eventDataWithoutId);
      }
    }
  } catch (error) {
    console.warn('Failed to save events to Firebase, falling back to localStorage:', error);
    // Fallback to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }
}

export async function loadRegion(): Promise<Region> {
  try {
    // Try to load from Firebase first
    const regionSnapshot = await getDocs(collection(db, SETTINGS_COLLECTION));
    
    if (!regionSnapshot.empty) {
      const regionData = regionSnapshot.docs.find((doc: any) => doc.id === 'selectedRegion');
      if (regionData) {
        const region = regionData.data().value as string;
        return (region === 'All' || region === 'KZN' || region === 'Gauteng') ? region : 'All';
      }
    }
  } catch (error) {
    console.warn('Failed to load region from Firebase, falling back to localStorage:', error);
  }
  
  // Fallback to localStorage
  try {
    const r = localStorage.getItem(REGION_KEY);
    return (r === 'All' || r === 'KZN' || r === 'Gauteng') ? r : 'All';
  } catch {
    return 'All';
  }
}

export async function saveRegion(region: Region): Promise<void> {
  try {
    // Save to Firebase
    await setDoc(doc(db, SETTINGS_COLLECTION, 'selectedRegion'), { value: region });
  } catch (error) {
    console.warn('Failed to save region to Firebase, falling back to localStorage:', error);
    // Fallback to localStorage
    localStorage.setItem(REGION_KEY, region);
  }
}

export async function updateEvent(updatedEvent: CalendarEvent): Promise<void> {
  try {
    // Update in Firebase
    const eventData = { ...updatedEvent };
    const { id, ...eventDataWithoutId } = eventData; // Remove id from data as it's the document ID
    await setDoc(doc(db, EVENTS_COLLECTION, updatedEvent.id), eventDataWithoutId);
  } catch (error) {
    console.warn('Failed to update event in Firebase, falling back to localStorage:', error);
    // Fallback to localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const events = JSON.parse(raw) as CalendarEvent[];
        const updatedEvents = events.map(event => 
          event.id === updatedEvent.id ? updatedEvent : event
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
      }
    } catch (localError) {
      console.error('Failed to update event in localStorage:', localError);
    }
  }
}

export async function deleteEvent(eventId: string): Promise<void> {
  try {
    // Delete from Firebase
    await deleteDoc(doc(db, EVENTS_COLLECTION, eventId));
  } catch (error) {
    console.warn('Failed to delete event from Firebase, falling back to localStorage:', error);
    // Fallback to localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const events = JSON.parse(raw) as CalendarEvent[];
        const filteredEvents = events.filter(event => event.id !== eventId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEvents));
      }
    } catch (localError) {
      console.error('Failed to delete event from localStorage:', localError);
    }
  }
}


