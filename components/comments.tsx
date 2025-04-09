"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FacebookIcon, InstagramIcon } from "lucide-react"

interface Comment {
  id: string
  text: string
  user: {
    name: string
    avatar: string
    socialType: "facebook" | "instagram"
    socialHandle: string
  }
  date: string
}

// Mock data
const mockComments: Comment[] = [
  {
    id: "1",
    text: "This festival was amazing last year! Can't wait to go again. The workshops with Carlos and Maria were top notch.",
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      socialType: "instagram",
      socialHandle: "@sarahdances",
    },
    date: "2023-04-10",
  },
  {
    id: "2",
    text: "Does anyone know if they will have the same DJ lineup as last year? The music selection was perfect!",
    user: {
      name: "Miguel Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      socialType: "facebook",
      socialHandle: "miguel.rodriguez",
    },
    date: "2023-04-12",
  },
]

export default function Comments({ festivalId }: { festivalId: string }) {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      user: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
        socialType: "instagram",
        socialHandle: "@yourusername",
      },
      date: new Date().toISOString().split("T")[0],
    }

    setComments([...comments, comment])
    setNewComment("")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comments</h2>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
              <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">{comment.user.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  {comment.user.socialType === "instagram" ? (
                    <InstagramIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <FacebookIcon className="h-3 w-3 mr-1" />
                  )}
                  {comment.user.socialHandle}
                </div>
              </div>

              <p className="mt-1">{comment.text}</p>

              <p className="text-xs text-muted-foreground mt-1">{comment.date}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Add a Comment</h3>
        <div className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this festival..."
            rows={4}
          />

          <Button onClick={handleAddComment}>Post Comment</Button>
        </div>
      </div>
    </div>
  )
}

