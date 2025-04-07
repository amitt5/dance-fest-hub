import Link from "next/link"
import type { Festival } from "@/lib/types"
import { formatDateRange } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"
import { Users } from "lucide-react"
import { SocialLinks } from "@/components/social-links"
import { ReportButton } from "@/components/report-button"

export default function FestivalList({ festivals }: { festivals: Festival[] }) {
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
                    src={festival.image || "/placeholder.svg"}
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
                  <StarRating rating={festival.rating} />
                </div>

                <p className="text-sm text-muted-foreground">{formatDateRange(festival.startDate, festival.endDate)}</p>

                <p className="font-medium text-white">
                  {festival.city}, {festival.country}
                </p>

                <div className="flex flex-wrap gap-2">
                  {festival.styles.map((style) => (
                    <Badge key={style} variant="outline" className="border-accent/50 text-white">
                      {style}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-white">
                    <span className="font-medium">Artists: </span>
                    {festival.artists.join(", ")}
                  </div>

                  <div className="flex items-center gap-3">
                    <SocialLinks festival={festival} />

                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">{festival.attendeeCount}</span>
                    </div>
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

