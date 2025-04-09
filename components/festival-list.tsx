import Link from "next/link"
import type { Event } from "@/lib/types"
import { formatDateRange } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"
import { Users } from "lucide-react"
import { SocialLinks } from "@/components/social-links"
import { ReportButton } from "@/components/report-button"

export default function FestivalList({ festivals }: { festivals: Event[] }) {
  return (
    <div className="space-y-4">
      {festivals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No festivals found matching your criteria</p>
        </div>
      ) : (
        festivals.map((festival) => (
          <div
            key={festival.id}
            className="border border-accent/50 rounded-lg p-4 hover:shadow-md transition-shadow bg-secondary"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/4 lg:w-1/6 relative">
                <Link href={`/festival/${festival.id}`}>
                  <img
                    src={festival.poster_url || "/placeholder.svg"}
                    alt={festival.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                </Link>
                <div className="absolute top-2 right-2">
                  <ReportButton festivalId={festival.id} variant="icon" />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <Link href={`/festival/${festival.id}`}>
                    <h2 className="text-xl font-bold hover:text-primary transition-colors text-white">
                      {festival.name}
                    </h2>
                  </Link>
                </div>

                <p className="text-sm text-muted-foreground">{formatDateRange(festival.start_date, festival.end_date)}</p>

                <p className="font-medium text-white">
                  {festival.city}, {festival.country}
                </p>

                <div className="flex flex-wrap gap-2">
                  {festival.event_styles.map((style) => (
                    <Badge key={style.style} variant="outline" className="border-accent/50 text-white">
                      {style.style}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-white">
                    <span className="font-medium">Artists: </span>
                    {festival.event_artists.map((ea) => ea.artist.name).join(", ")}
                  </div>

                  <div className="flex items-center gap-3">
                    <SocialLinks festival={festival} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

