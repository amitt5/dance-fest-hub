import Link from "next/link"
import type { Festival } from "@/lib/types"
import { formatDateRange } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"
import { Users } from "lucide-react"
import { SocialLinks } from "@/components/social-links"
import { ReportButton } from "@/components/report-button"

export default function FestivalGrid({ festivals }: { festivals: Festival[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {festivals.length === 0 ? (
        <div className="text-center py-12 col-span-full">
          <p className="text-muted-foreground">No festivals found matching your criteria</p>
        </div>
      ) : (
        festivals.map((festival) => (
          <Card
            key={festival.id}
            className="overflow-hidden hover:shadow-lg transition-shadow bg-secondary border-accent/50"
          >
            <Link href={`/festival/${festival.id}`}>
              <div className="h-48 overflow-hidden relative">
                <img
                  src={festival.image || "/placeholder.svg"}
                  alt={festival.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <ReportButton festivalId={festival.id} variant="icon" />
                </div>
              </div>
            </Link>

            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <Link href={`/festival/${festival.id}`}>
                  <h3 className="font-bold hover:text-primary transition-colors line-clamp-1 text-white">
                    {festival.name}
                  </h3>
                </Link>
                <StarRating rating={festival.rating} />
              </div>

              <p className="text-sm text-muted-foreground">{formatDateRange(festival.startDate, festival.endDate)}</p>

              <p className="text-sm font-medium text-white">
                {festival.city}, {festival.country}
              </p>

              <div className="flex justify-between items-center">
                <SocialLinks festival={festival} />

                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">{festival.attendeeCount}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <div className="flex flex-wrap gap-1">
                {festival.styles.map((style) => (
                  <Badge key={style} variant="outline" className="text-xs border-accent/50 text-white">
                    {style}
                  </Badge>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}

