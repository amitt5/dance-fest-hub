import type { Event } from "@/lib/types"
import { Facebook, Instagram } from "lucide-react"

interface SocialLinksProps {
  festival: Event
  size?: "sm" | "md" | "lg"
}

export function SocialLinks({ festival, size = "sm" }: SocialLinksProps) {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <div className="flex items-center gap-2">
      {festival.facebook_link && (
        <a
          href={festival.facebook_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700"
        >
          <Facebook className={sizeClass[size]} />
        </a>
      )}

      {festival.instagram_link && (
        <a
          href={festival.instagram_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-500 hover:text-pink-700"
        >
          <Instagram className={sizeClass[size]} />
        </a>
      )}
    </div>
  )
}

