"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Flag } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { ReportReason } from "@/lib/types"

interface ReportButtonProps {
  festivalId: string
  variant?: "button" | "icon"
}

export function ReportButton({ festivalId, variant = "button" }: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState<ReportReason | "">("")
  const [details, setDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!reason) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Reporting festival", {
        festivalId,
        reason,
        details,
      })

      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after 2 seconds and close dialog
      setTimeout(() => {
        setReason("")
        setDetails("")
        setIsSubmitted(false)
        setIsOpen(false)
      }, 2000)
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-black/50 hover:bg-black/70 text-white">
            <Flag className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="text-red-500 border-red-500 hover:bg-red-500/10">
            <Flag className="h-4 w-4 mr-2" />
            Report Issue
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="bg-secondary border-accent/50 text-white">
        <DialogHeader>
          <DialogTitle>Report Festival Issue</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Let us know if there's a problem with this festival listing.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-6 text-center">
            <p className="text-green-500 font-medium">Thank you for your report!</p>
            <p className="text-muted-foreground mt-2">We'll review this issue shortly.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for reporting</Label>
                <Select value={reason} onValueChange={(value) => setReason(value as ReportReason)}>
                  <SelectTrigger id="reason" className="bg-secondary border-border">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    <SelectItem value="duplicate">Duplicate listing</SelectItem>
                    <SelectItem value="not-exist">Event doesn't exist</SelectItem>
                    <SelectItem value="cancelled">Event has been cancelled</SelectItem>
                    <SelectItem value="incorrect-info">Incorrect information</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">Additional details</Label>
                <Textarea
                  id="details"
                  placeholder="Please provide any additional information..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="bg-secondary border-border"
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="border-white text-white hover:bg-secondary/80"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!reason || isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

