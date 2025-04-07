"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram } from "lucide-react"

interface Attendee {
  id: string
  name: string
  avatar: string
  socialType: "facebook" | "instagram"
  socialHandle: string
}

// Mock data
const mockAttendees: Attendee[] = [
  {
    id: "1",
    name: "Maria Garcia",
    avatar: "/placeholder.svg?height=48&width=48",
    socialType: "instagram",
    socialHandle: "@maria_dances",
  },
  {
    id: "2",
    name: "John Smith",
    avatar: "/placeholder.svg?height=48&width=48",
    socialType: "facebook",
    socialHandle: "john.smith",
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    avatar: "/placeholder.svg?height=48&width=48",
    socialType: "instagram",
    socialHandle: "@elena_salsa",
  },
  {
    id: "4",
    name: "Carlos Mendez",
    avatar: "/placeholder.svg?height=48&width=48",
    socialType: "instagram",
    socialHandle: "@carlos_bachata",
  },
  {
    id: "5",
    name: "Sophie Williams",
    avatar: "/placeholder.svg?height=48&width=48",
    socialType: "facebook",
    socialHandle: "sophie.williams",
  },
  {
    id: "6",
    name: "David Johnson",
    avatar: "/placeholder.svg?height=48&width=48",
    socialType: "instagram",
    socialHandle: "@david_kizomba",
  },
]

export default function Attendees({ festivalId }: { festivalId: string }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Who's Going</h2>
        <Button>I'm Going!</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mockAttendees.map((attendee) => (
          <div
            key={attendee.id}
            className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={attendee.avatar} alt={attendee.name} />
              <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-medium">{attendee.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                {attendee.socialType === "instagram" ? (
                  <Instagram className="h-3 w-3 mr-1" />
                ) : (
                  <Facebook className="h-3 w-3 mr-1" />
                )}
                {attendee.socialHandle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

