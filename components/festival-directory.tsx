"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Event } from "@/lib/types"
import FestivalList from "@/components/festival-list"
import FestivalGrid from "@/components/festival-grid"
import { ListFilter, Grid, List } from "lucide-react"
import { DANCE_STYLES, MONTHS } from "@/lib/constants"

export default function FestivalDirectory() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
  const [festivals, setFestivals] = useState<Event[]>([])
  const [filters, setFilters] = useState({
    month: "",
    country: "",
    styles: [] as string[],
    artist: "",
  })

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        
        const data = await response.json()
        setEvents(data)
        setFestivals(data) // Initialize festivals with fetched data
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setIsLoadingEvents(false)
      }
    }

    fetchEvents()
  }, [])

  // Get unique countries, months, and artists for filter dropdowns
  const countries = Array.from(new Set(events.map((f) => f.country)))
  
  const artists = Array.from(new Set(events.flatMap((f) => 
    f.event_artists?.map((ea) => ea.artist.name)
  )))

  const handleStyleChange = (style: string) => {
    setFilters((prev) => {
      const newStyles = prev.styles.includes(style) 
        ? prev.styles.filter((s) => s !== style) 
        : [...prev.styles, style]
      return { ...prev, styles: newStyles }
    })
  }

  const applyFilters = () => {
    let filtered = [...events]

    if (filters.month) {
      filtered = filtered.filter((f) => {
        const festivalMonth = new Date(f.start_date).toLocaleString("default", { month: "long" })
        return festivalMonth === filters.month
      })
    }

    if (filters.country) {
      filtered = filtered.filter((f) => f.country === filters.country)
    }

    if (filters.styles.length > 0) {
      filtered = filtered.filter((f) => 
        filters.styles.some((style) => 
          f.event_styles.some((es) => es.style === style)
        )
      )
    }

    if (filters.artist) {
      filtered = filtered.filter((f) => 
        f.event_artists.some((ea) => ea.artist.name === filters.artist)
      )
    }

    setFestivals(filtered)
  }

  const resetFilters = () => {
    setFilters({
      month: "",
      country: "",
      styles: [],
      artist: "",
    })
    setFestivals(events)
  }

  return (
    <div className="space-y-6">
      <div className="bg-secondary p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="space-y-2 flex-1">
            <h3 className="font-medium text-white">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block text-white">Month</label>
                <Select value={filters.month} onValueChange={(value) => setFilters({ ...filters, month: value })}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    <SelectItem value="all">All Months</SelectItem>
                    {MONTHS.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block text-white">Country</label>
                <Select value={filters.country} onValueChange={(value) => setFilters({ ...filters, country: value })}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block text-white">Artist/DJ</label>
                <Select value={filters.artist} onValueChange={(value) => setFilters({ ...filters, artist: value })}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select artist" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    <SelectItem value="all">All Artists</SelectItem>
                    {artists.map((artist) => (
                      <SelectItem key={artist} value={artist}>
                        {artist}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block text-white">Dance Styles</label>
                <div className="flex flex-wrap gap-3">
                  {DANCE_STYLES.map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <Checkbox
                        id={`style-${style}`}
                        checked={filters.styles.includes(style)}
                        onCheckedChange={() => handleStyleChange(style)}
                        className="border-white data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label
                        htmlFor={`style-${style}`}
                        className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {style}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={applyFilters} className="flex-1 md:flex-none bg-primary hover:bg-primary/90">
              <ListFilter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="flex-1 md:flex-none border-white text-white hover:bg-secondary/80"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={
              viewMode === "grid" ? "bg-primary hover:bg-primary/90" : "border-white text-white hover:bg-secondary/80"
            }
          >
            <Grid className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={
              viewMode === "list" ? "bg-primary hover:bg-primary/90" : "border-white text-white hover:bg-secondary/80"
            }
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>

        <Button asChild className="bg-primary hover:bg-primary/90">
          <a href="/add-event">Add Event</a>
        </Button>
      </div>

      {isLoadingEvents ? (
        <div className="text-center py-8">Loading events...</div>
      ) : festivals.length === 0 ? (
        <div className="text-center py-8">No events found matching your criteria.</div>
      ) : viewMode === "list" ? (
        <FestivalList festivals={festivals} />
      ) : (
        <FestivalGrid festivals={festivals} />
      )}
    </div>
  )
}

