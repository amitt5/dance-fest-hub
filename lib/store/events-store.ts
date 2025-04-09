import { create } from 'zustand'
import { Event } from '@/lib/types'

interface EventsState {
  events: Event[]
  isLoading: boolean
  error: string | null
  fetchEvents: () => Promise<void>
  getEventById: (id: string) => Event | undefined
  setEvents: (events: Event[]) => void
}

export const useEventsStore = create<EventsState>((set: any, get: any) => ({
  events: [],
  isLoading: false,
  error: null,
  
  fetchEvents: async () => {
    // If we already have events, don't fetch again
    if (get().events.length > 0) return
    
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch('/api/events')
      
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      
      const data = await response.json()
      set({ events: data, isLoading: false })
    } catch (error) {
      console.error('Error fetching events:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch events', 
        isLoading: false 
      })
    }
  },
  
  getEventById: (id: string) => {
    return get().events.find((event: Event) => event.id === id)
  },
  
  setEvents: (events: Event[]) => {
    set({ events })
  }
})) 