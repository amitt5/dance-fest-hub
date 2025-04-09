"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEventsStore } from "@/lib/store/events-store"
import { Event } from "@/lib/types"
import EventForm from "@/components/event-form"

export default function EditEventPage({
  params,
}: {
  params: { id: string }
}) {
  const [festival, setFestival] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Use the Zustand store
  const { events, getEventById, fetchEvents } = useEventsStore()
  
  // Extract the ID
  const id = params.id
  
  useEffect(() => {
    const loadEvent = async () => {
      setIsLoading(true)
      
      // First try to get the event from the store
      const eventFromStore = getEventById(id)
      
      if (eventFromStore) {
        setFestival(eventFromStore)
        setIsLoading(false)
        return
      }
      
      // If not in store, try to fetch all events
      if (events.length === 0) {
        await fetchEvents()
        
        // Check again after fetching all events
        const eventAfterFetch = getEventById(id)
        if (eventAfterFetch) {
          setFestival(eventAfterFetch)
          setIsLoading(false)
          return
        }
      }
      
      // If still not found, fetch directly from API
      try {
        const response = await fetch(`/api/events/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch event')
        }
        
        const data = await response.json()
        setFestival(data)
      } catch (err) {
        console.error('Error fetching event:', err)
        setError('Failed to load event. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadEvent()
  }, [id, events, getEventById, fetchEvents])
  
  if (isLoading) {
    return <div className="text-center py-8">Loading event...</div>
  }
  
  if (error || !festival) {
    return <div className="text-center py-8 text-destructive">{error || 'Event not found'}</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link href={`/festival/${festival.id}`}>
          <Button variant="outline" className="border-white text-white hover:bg-secondary/80">
            ← Back to Event
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit Event</h1>
      </div>
      
      <EventForm initialData={festival} />
    </div>
  )
}

