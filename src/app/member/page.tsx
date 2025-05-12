"use client";

import { useEffect, useState } from "react";
import { Event } from "@/interfaces/event";
import { useSession } from "next-auth/react"; // Kalau kamu pakai next-auth
import { Member } from "@/interfaces/member";

export default function MemberEventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [participatedEventIds, setParticipatedEventIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const memberId = "member-aktif-id"; // TODO: ganti ini dengan data session

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/event");
        const data = await res.json();
        setEvents(data);

        // Fetch event yang sudah diikuti
        const res2 = await fetch(`/api/member/${memberId}/events`);
        const data2 = await res2.json();
        const ids = data2.map((e: { eventId: string }) => e.eventId);
        setParticipatedEventIds(ids);
      } catch (err) {
        console.error("Error loading events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [memberId]);

  const handleParticipate = async (eventId: string) => {
    try {
      const res = await fetch(`/api/event/${eventId}/participants`, {
        method: "POST",
        body: JSON.stringify({ memberId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setParticipatedEventIds((prev) => [...prev, eventId]);
      } else {
        alert("Gagal ikut event");
      }
    } catch (err) {
      console.error("Gagal join event:", err);
    }
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Daftar Event</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <div key={event.id} className="border p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
            <p className="mt-2 text-gray-700">{event.description}</p>
            <p className="text-sm mt-1 text-gray-500">Lokasi: {event.location}</p>

            {participatedEventIds.includes(event.id) ? (
              <button
                disabled
                className="mt-4 px-4 py-2 bg-gray-400 text-white text-sm rounded"
              >
                Participated
              </button>
            ) : (
              <button
                onClick={() => handleParticipate(event.id)}
                className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
              >
                Participate
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
