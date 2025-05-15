"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"

// Define proper interfaces based on your Prisma schema
interface Member {
  id: string
  name: string
  gender: "MALE" | "FEMALE"
  birthdate: string
  class: string
  email: string
  status: boolean
  position: string
  joined_at: string
}

interface EventMember {
  id: string
  eventId: string
  memberId: string
  createdAt: string // This is the join date
  member: Member // Make sure this is included in the API response
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  participants: EventMember[]
}

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  // Function to remove participant (moved before the return statement)
  const handleRemoveParticipant = async (participantId: string) => {
    const confirmed = confirm("Yakin ingin menghapus peserta ini?")
    if (!confirmed) return

    try {
      const res = await fetch(`/api/events/${id}/participants/${participantId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        // Update the event state to remove the participant
        if (event) {
          setEvent({
            ...event,
            participants: event.participants.filter((p) => p.id !== participantId),
          })
        }
      } else {
        const errorData = await res.json()
        setError(errorData.message || "Gagal menghapus peserta")
      }
    } catch (error) {
      console.error("Gagal menghapus peserta:", error)
      setError("Terjadi kesalahan saat menghapus peserta")
    }
  }

  useEffect(() => {
    const fetchEventDetail = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        // Fetch event with participants included
        const res = await fetch(`/api/events/${id}`)

        if (!res.ok) {
          throw new Error(`Failed to fetch event: ${res.status}`)
        }

        const data = await res.json()
        console.log("Event data:", data) // Debug: Check the structure of the returned data
        setEvent(data)
      } catch (error) {
        console.error("Gagal mengambil data event:", error)
        setError("Gagal mengambil data event")
      } finally {
        setLoading(false)
      }
    }

    fetchEventDetail()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center">Event tidak ditemukan.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">{event.title}</h1>
      <div className="mb-6 space-y-2">
        <p>
          <strong>Deskripsi:</strong> {event.description}
        </p>
        <p>
          <strong>Tanggal:</strong> {format(new Date(event.date), "PPP")}
        </p>
        <p>
          <strong>Lokasi:</strong> {event.location || "Belum ditentukan"}
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-4">Peserta Event</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Nama Peserta</th>
            <th className="p-2">Kelas</th>
            <th className="p-2">Tanggal Bergabung</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {!event.participants || event.participants.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4">
                Tidak ada peserta.
              </td>
            </tr>
          ) : (
            event.participants.map((participant) => (
              <tr key={participant.id} className="border-t">
                <td className="p-2">{participant.member?.name || "Unknown"}</td>
                <td className="p-2">{participant.member?.class || "Unknown"}</td>
                <td className="p-2">{format(new Date(participant.createdAt), "PPP")}</td>
                <td className="p-2 space-x-2">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleRemoveParticipant(participant.id)}
                  >
                    Hapus Peserta
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-end space-x-2 mt-4">
        <button onClick={() => router.push("/dashboard/event")} className="px-4 py-2 border rounded">
          Kembali ke Daftar Event
        </button>
      </div>
    </div>
  )
}
