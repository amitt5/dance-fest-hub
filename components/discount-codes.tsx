"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"

interface DiscountCode {
  id: string
  code: string
  description: string
  upvotes: number
  downvotes: number
  user_id: string
  created_at: string
}

export default function DiscountCodes({ festivalId }: { festivalId: string }) {
  const [user, setUser] = useState<any>(null)
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([])
  const [newCode, setNewCode] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Get user session on component mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('session1121', session)
      setUser(session?.user || null)
    }
    
    getUser()
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  // Fetch discount codes on component mount
  useEffect(() => {
    fetchDiscountCodes()
  }, [festivalId])

  const fetchDiscountCodes = async () => {
    try {
      const response = await fetch(`/api/discount_codes?eventId=${festivalId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch discount codes')
      }
      const data = await response.json()
      setDiscountCodes(data)
    } catch (error) {
      console.error('Error fetching discount codes:', error)
      toast.error('Failed to load discount codes')
    }
  }

  const handleAddCode = async () => {
    if (!newCode || !newDescription) return
    if (!user) {
      toast.error('You must be logged in to add discount codes')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/discount_codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: newCode,
          description: newDescription,
          eventId: festivalId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add discount code')
      }

      const newDiscountCode = await response.json()
      setDiscountCodes([newDiscountCode, ...discountCodes])
      setNewCode("")
      setNewDescription("")
      toast.success('Discount code added successfully')
    } catch (error) {
      console.error('Error adding discount code:', error)
      toast.error('Failed to add discount code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (id: string, isUpvote: boolean) => {
    if (!user) {
      toast.error('You must be logged in to vote')
      return
    }

    try {
      const response = await fetch(`/api/discount_codes/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isUpvote,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to vote')
      }

      // Refresh the discount codes after voting
      fetchDiscountCodes()
    } catch (error) {
      console.error('Error voting:', error)
      toast.error('Failed to register your vote')
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Discount Codes</h2>

      <div className="space-y-4">
        {discountCodes.length === 0 ? (
          <p className="text-muted-foreground">No discount codes available yet.</p>
        ) : (
          discountCodes.map((code) => (
            <div key={code.id} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-bold font-mono">{code.code}</h3>
                  <p className="text-muted-foreground">{code.description}</p>
                  <p className="text-xs mt-2">
                    Added on {new Date(code.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleVote(code.id, true)}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                    disabled={!user}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{code.upvotes}</span>
                  </button>

                  <button
                    onClick={() => handleVote(code.id, false)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                    disabled={!user}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>{code.downvotes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
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
              disabled={!user || isLoading}
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
              disabled={!user || isLoading}
            />
          </div>

          <Button 
            onClick={handleAddCode} 
            disabled={!user || isLoading || !newCode || !newDescription}
          >
            {isLoading ? 'Adding...' : 'Add Discount Code'}
          </Button>
          
          {!user && (
            <p className="text-sm text-amber-600">
              Please log in to add discount codes
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

