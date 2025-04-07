"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Festival } from "@/lib/types"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, X, Facebook, Instagram } from "lucide-react"
import { COUNTRIES, DANCE_STYLES } from "@/lib/constants"

interface EventFormProps {
  initialData?: Festival
}

interface Artist {
  id: string
  name: string
}

export default function EventForm({ initialData }: EventFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<Festival>>(
    initialData || {
      name: "",
      startDate: "",
      endDate: "",
      city: "",
      country: "",
      website: "",
      facebookPage: "",
      instagramPage: "",
      description: "",
      styles: [],
      artists: [],
      image: "/placeholder.svg?height=400&width=600",
      attendeeCount: 0,
    },
  )

  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.startDate ? new Date(initialData.startDate) : undefined,
  )

  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData?.endDate ? new Date(initialData.endDate) : undefined,
  )

  const [newArtist, setNewArtist] = useState("")
  const [allArtists, setAllArtists] = useState<Artist[]>([])
  const [isLoadingArtists, setIsLoadingArtists] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch('/api/artists')
        if (!response.ok) {
          throw new Error('Failed to fetch artists')
        }
        const data = await response.json()
        setAllArtists(data)
      } catch (error) {
        console.error('Error fetching artists:', error)
      } finally {
        setIsLoadingArtists(false)
      }
    }

    fetchArtists()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleStyleChange = (style: string) => {
    setFormData((prev) => {
      const styles = prev.styles || []
      return {
        ...prev,
        styles: styles.includes(style) ? styles.filter((s) => s !== style) : [...styles, style],
      }
    })
  }

  const handleArtistChange = (artistName: string) => {
    setFormData((prev) => {
      const artists = prev.artists || []
      return {
        ...prev,
        artists: artists.includes(artistName) ? artists.filter((a) => a !== artistName) : [...artists, artistName],
      }
    })
  }

  const handleAddNewArtist = async () => {
    if (!newArtist.trim()) return

    try {
      // Save artist to database
      const response = await fetch('/api/artists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newArtist.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to save artist')
      }

      const savedArtist = await response.json()
      
      // Update allArtists state with the new artist
      setAllArtists(prev => [...prev, savedArtist])

      // Update form data with new artist
      setFormData((prev) => {
        const artists = prev.artists || []
        if (!artists.includes(savedArtist.name)) {
          return {
            ...prev,
            artists: [...artists, savedArtist.name],
          }
        }
        return prev
      })

      setNewArtist("")
    } catch (error) {
      console.error('Error saving artist:', error)
    }
  }

  const handleRemoveArtist = (artist: string) => {
    setFormData((prev) => {
      const artists = prev.artists || []
      return {
        ...prev,
        artists: artists.filter((a) => a !== artist),
      }
    })
  }

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date)
    if (date) {
      setFormData({ ...formData, startDate: date.toISOString().split("T")[0] })
    }
  }

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date)
    if (date) {
      setFormData({ ...formData, endDate: date.toISOString().split("T")[0] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          startDate: startDate?.toISOString().split('T')[0],
          endDate: endDate?.toISOString().split('T')[0],
          city: formData.city,
          country: formData.country,
          website: formData.website || null,
          description: formData.description || null,
          posterUrl: formData.image !== '/placeholder.svg?height=400&width=600' ? formData.image : null,
          facebookLink: formData.facebookPage || null,
          instagramLink: formData.instagramPage || null,
          artists: formData.artists || [],
          styles: formData.styles || [],
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create event')
      }

      const data = await response.json()
      console.log('Created event:', data)

      router.push('/events')
    } catch (err) {
      console.error('Error details:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-white">
            Event Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="bg-secondary border-border"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border-border bg-secondary"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-secondary border-border">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateChange}
                  initialFocus
                  className="bg-secondary"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="text-white">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border-border bg-secondary"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-secondary border-border">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateChange}
                  initialFocus
                  className="bg-secondary"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city" className="text-white">
              City
            </Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <Label htmlFor="country" className="text-white">
              Country
            </Label>
            <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-secondary border-border">
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="website" className="text-white">
            Website / Ticket Link
          </Label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            type="url"
            placeholder="https://"
            className="bg-secondary border-border"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="facebookPage" className="text-white flex items-center">
              <Facebook className="h-4 w-4 mr-2 text-blue-500" />
              Facebook Page
            </Label>
            <Input
              id="facebookPage"
              name="facebookPage"
              value={formData.facebookPage}
              onChange={handleInputChange}
              type="url"
              placeholder="https://facebook.com/yourevent"
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <Label htmlFor="instagramPage" className="text-white flex items-center">
              <Instagram className="h-4 w-4 mr-2 text-pink-500" />
              Instagram Page
            </Label>
            <Input
              id="instagramPage"
              name="instagramPage"
              value={formData.instagramPage}
              onChange={handleInputChange}
              type="url"
              placeholder="https://instagram.com/yourevent"
              className="bg-secondary border-border"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-white">
            Event Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
            required
            className="bg-secondary border-border"
          />
        </div>

        <div>
          <Label className="text-white">Dance Styles</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {DANCE_STYLES.map((style) => (
              <div key={style} className="flex items-center space-x-2">
                <Checkbox
                  id={`style-${style}`}
                  checked={(formData.styles || []).includes(style)}
                  onCheckedChange={() => handleStyleChange(style)}
                  className="border-white data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor={`style-${style}`} className="text-sm font-normal cursor-pointer text-white">
                  {style}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-white">Artists & DJs</Label>
          {isLoadingArtists ? (
            <div className="text-center py-4 text-muted-foreground">Loading artists...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {allArtists.map((artist) => (
                <div key={artist.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`artist-${artist.id}`}
                    checked={(formData.artists || []).includes(artist.name)}
                    onCheckedChange={() => handleArtistChange(artist.name)}
                    className="border-white data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={`artist-${artist.id}`} className="text-sm font-normal cursor-pointer text-white">
                    {artist.name}
                  </Label>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2 mt-4">
            <Input
              placeholder="Add new artist/DJ"
              value={newArtist}
              onChange={(e) => setNewArtist(e.target.value)}
              className="bg-secondary border-border"
            />
            <Button type="button" onClick={handleAddNewArtist} className="bg-primary hover:bg-primary/90">
              Add
            </Button>
          </div>

          {(formData.artists || []).length > 0 && (
            <div className="mt-4">
              <Label className="text-white">Selected Artists:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(formData.artists || []).map((artist) => (
                  <div
                    key={artist}
                    className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center border border-border"
                  >
                    {artist}
                    <button
                      type="button"
                      onClick={() => handleRemoveArtist(artist)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="image" className="text-white">
            Poster/Image Upload
          </Label>
          <div className="mt-2">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-secondary">
              <div className="mb-4">
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt="Event poster preview"
                  className="mx-auto h-48 object-contain"
                />
              </div>
              <Button type="button" variant="outline" className="border-white text-white hover:bg-secondary/80">
                Upload Image
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Supported formats: JPG, PNG, GIF (max 5MB)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-white text-white hover:bg-secondary/80"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? 'Saving...' : 'Save Event'}
        </Button>
      </div>
    </form>
  )
}

