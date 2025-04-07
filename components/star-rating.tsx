"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  editable?: boolean
  onRatingChange?: (rating: number) => void
  size?: "sm" | "md" | "lg"
}

export function StarRating({ rating, editable = false, onRatingChange, size = "md" }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClass = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${editable ? "cursor-pointer" : "cursor-default"} p-0.5`}
          onClick={() => editable && onRatingChange && onRatingChange(star)}
          onMouseEnter={() => editable && setHoverRating(star)}
          onMouseLeave={() => editable && setHoverRating(0)}
          disabled={!editable}
        >
          <Star
            className={`${sizeClass[size]} ${
              star <= (hoverRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

