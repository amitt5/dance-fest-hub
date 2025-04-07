"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThumbsUp, ThumbsDown } from "lucide-react"

interface DiscountCode {
  id: string
  code: string
  description: string
  upvotes: number
  downvotes: number
  addedBy: string
  addedDate: string
}

// Mock data
const mockDiscountCodes: DiscountCode[] = [
  {
    id: "1",
    code: "EARLY2023",
    description: "15% off if you book before June",
    upvotes: 12,
    downvotes: 2,
    addedBy: "dancefan123",
    addedDate: "2023-04-15",
  },
  {
    id: "2",
    code: "INSTA10",
    description: "10% discount from Instagram promo",
    upvotes: 8,
    downvotes: 1,
    addedBy: "salsaqueen",
    addedDate: "2023-04-20",
  },
]

export default function DiscountCodes({ festivalId }: { festivalId: string }) {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(mockDiscountCodes)
  const [newCode, setNewCode] = useState("")
  const [newDescription, setNewDescription] = useState("")

  const handleAddCode = () => {
    if (!newCode || !newDescription) return

    const newDiscountCode: DiscountCode = {
      id: Date.now().toString(),
      code: newCode,
      description: newDescription,
      upvotes: 0,
      downvotes: 0,
      addedBy: "You",
      addedDate: new Date().toISOString().split("T")[0],
    }

    setDiscountCodes([...discountCodes, newDiscountCode])
    setNewCode("")
    setNewDescription("")
  }

  const handleVote = (id: string, isUpvote: boolean) => {
    setDiscountCodes(
      discountCodes.map((code) => {
        if (code.id === id) {
          if (isUpvote) {
            return { ...code, upvotes: code.upvotes + 1 }
          } else {
            return { ...code, downvotes: code.downvotes + 1 }
          }
        }
        return code
      }),
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Discount Codes</h2>

      <div className="space-y-4">
        {discountCodes.map((code) => (
          <div key={code.id} className="border rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-bold font-mono">{code.code}</h3>
                <p className="text-muted-foreground">{code.description}</p>
                <p className="text-xs mt-2">
                  Added by {code.addedBy} on {code.addedDate}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleVote(code.id, true)}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{code.upvotes}</span>
                </button>

                <button
                  onClick={() => handleVote(code.id, false)}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>{code.downvotes}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Add New Discount Code</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium mb-1">
              Code
            </label>
            <Input
              id="code"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="e.g., SUMMER2023"
              className="font-mono"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Input
              id="description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="e.g., 10% off early bird tickets"
            />
          </div>

          <Button onClick={handleAddCode}>Add Discount Code</Button>
        </div>
      </div>
    </div>
  )
}

