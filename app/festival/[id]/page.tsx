import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarRating } from "@/components/star-rating"
import { getFestivalById } from "@/lib/data"
import { formatDateRange } from "@/lib/utils"
import { ExternalLink, Edit, Users } from "lucide-react"
import DiscountCodes from "@/components/discount-codes"
import Comments from "@/components/comments"
import Attendees from "@/components/attendees"
import EditHistory from "@/components/edit-history"
import { SocialLinks } from "@/components/social-links"
import { ReportButton } from "@/components/report-button"

export default async function FestivalPage({
  params,
}: {
  params: { id: string }
}) {
  const festival = await getFestivalById(params.id)

  if (!festival) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <Button variant="outline" className="border-white text-white hover:bg-secondary/80">
            ← Back to Festivals
          </Button>
        </Link>
        <div className="flex gap-2">
          <ReportButton festivalId={festival.id} />
          <Link href={`/edit-event/${festival.id}`}>
            <Button variant="outline" className="border-white text-white hover:bg-secondary/80">
              <Edit className="mr-2 h-4 w-4" />
              Edit Event
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-1">
          <img src={festival.poster_url || "/placeholder.svg"} alt={festival.name} className="w-full rounded-lg shadow-md" />
        </div>

        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold text-white">{festival.name}</h1>

          <div className="flex items-center space-x-2">
            <StarRating rating={festival.rating || 0} size="lg" />
            <span className="text-muted-foreground">({festival.rating?.toFixed(1)})</span>
          </div>

          <p className="text-lg font-medium text-white">{formatDateRange(festival.start_date, festival.end_date)}</p>

          <p className="text-lg text-white">
            {festival.city}, {festival.country}
          </p>

          <div className="flex flex-wrap gap-2">
            {festival.event_styles.map((style) => (
              <Badge key={style.style} className="bg-primary text-white hover:bg-primary/90">
                {style.style}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {festival.website && (
              <a
                href={festival.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                Visit Website / Buy Tickets
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            )}

            <div className="flex items-center gap-3">
              <SocialLinks festival={festival} size="md" />

              <div className="flex items-center text-muted-foreground">
                <Users className="h-5 w-5 mr-1" />
                <span>{festival.attendeeCount} attending</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-lg font-medium mb-2 text-white">Artists & DJs</h3>
            <div className="flex flex-wrap gap-2">
              {festival.event_artists.map((artist) => (
                <div key={artist.artist.id} className="flex items-center bg-secondary px-3 py-1 rounded-full text-sm">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={`/placeholder.svg?height=24&width=24`} alt={artist.artist.name} />
                    <AvatarFallback>{artist.artist.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {artist.artist.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="grid grid-cols-5 w-full bg-secondary">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary">
            Overview
          </TabsTrigger>
          <TabsTrigger value="discounts" className="data-[state=active]:bg-primary">
            Discount Codes
          </TabsTrigger>
          <TabsTrigger value="comments" className="data-[state=active]:bg-primary">
            Comments
          </TabsTrigger>
          <TabsTrigger value="attendees" className="data-[state=active]:bg-primary">
            Who's Going
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary">
            Edit History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-white">About This Festival</h2>
            <p className="text-white">{festival.description}</p>
          </div>
        </TabsContent>

        <TabsContent value="discounts" className="mt-6">
          <DiscountCodes festivalId={festival.id} />
        </TabsContent>

        <TabsContent value="comments" className="mt-6">
          <Comments festivalId={festival.id} />
        </TabsContent>

        <TabsContent value="attendees" className="mt-6">
          <Attendees festivalId={festival.id} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <EditHistory festivalId={festival.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

