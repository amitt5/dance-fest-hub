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

