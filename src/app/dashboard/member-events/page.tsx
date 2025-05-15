"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { EventCard } from "./components/event-card"

interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
}

export default function MemberEventPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [participatedEventIds, setParticipatedEventIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get memberId from cookie instead of localStorage
    const memberId = localStorage.getItem('id')

    if (!memberId) {
      // Redirect to login if no member ID is found
      router.push("/auth/login")
      return
    }

    const fetchEvents = async () => {
      try {
        // Fetch all events
        const eventsRes = await fetch("/api/event")
        if (!eventsRes.ok) throw new Error("Failed to fetch events")
        const eventsData = await eventsRes.json()
        setEvents(eventsData)

        // Fetch events the member is participating in
        const participationRes = await fetch(`/api/member/${memberId}/participate`)
        if (!participationRes.ok) throw new Error("Failed to fetch participation data")
        const participationData = await participationRes.json()
        console.log(participationData)

        // Extract event IDs the member is participating in
        const participatedIds = participationData.map((item: { eventId: string }) => item.eventId)

        setParticipatedEventIds(participatedIds)
      } catch (err) {
        console.error("Error loading events", err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [router])

  const handleParticipate = async (eventId: string): Promise<boolean> => {
    const memberId = localStorage.getItem('id')
    if (!memberId) {
      router.push("/login")
      return false
    }

    try {
      const res = await fetch(`/api/event/${eventId}/participate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // No need to send memberId in body, we'll get it from the cookie in the API
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to join event")
      }

      // Update the local state
      setParticipatedEventIds((prev) => [...prev, eventId])
      return true
    } catch (err) {
      console.error("Failed to join event:", err)
      return false
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Available Events</h1>

      {events.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No events available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isParticipating={participatedEventIds.includes(event.id)}
              onParticipate={handleParticipate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
