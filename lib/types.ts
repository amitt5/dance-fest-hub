export interface Festival {
  id: string
  name: string
  startDate: string
  endDate: string
  city: string
  country: string
  description: string
  styles: string[]
  artists: string[]
  image: string
  website?: string
  facebookPage?: string
  instagramPage?: string
  rating: number
  attendeeCount: number
}

export interface Event {
  id: string
  name: string
  start_date: string
  end_date: string
  city: string
  country: string
  website?: string
  facebook_link?: string
  instagram_link?: string
  description?: string
  poster_url?: string
  created_by?: string
  created_at: string
  event_styles: { style: string }[]
  event_artists: { artist: { id: string, name: string } }[]
}

export type ReportReason = "duplicate" | "not-exist" | "cancelled" | "incorrect-info" | "other"

export interface Report {
  id: string
  festivalId: string
  reason: ReportReason
  details?: string
  reportedBy: string
  reportedAt: string
  status: "pending" | "reviewed" | "resolved"
}

