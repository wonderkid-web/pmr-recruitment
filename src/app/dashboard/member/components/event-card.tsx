"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"



interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
}

interface EventCardProps {
  event: Event
  isParticipating: boolean
  onParticipate: (eventId: string) => Promise<boolean>
}

export function EventCard({ event, isParticipating, onParticipate }: EventCardProps) {
  const [participating, setParticipating] = useState(isParticipating)
  const [loading, setLoading] = useState(false)

  const handleParticipate = async () => {
    if (participating) return

    setLoading(true)
    try {
      const success = await onParticipate(event.id)
      if (success) {
        setParticipating(true)
        toast.info(`You are now participating in "${event.title}"`)
      }
    } catch (error) {
      toast.error("Failed to join the event. Please try again." + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{format(new Date(event.date), "PPP 'at' p")}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 mb-2">{event.description}</p>
        <p className="text-xs text-muted-foreground">Location: {event.location || "TBA"}</p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleParticipate}
          disabled={participating || loading}
          className="w-full"
          variant={participating ? "outline" : "default"}
        >
          {loading ? "Processing..." : participating ? "Participating" : "Participate"}
        </Button>
      </CardFooter>
    </Card>
  )
}
