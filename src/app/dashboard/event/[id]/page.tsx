"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Event, EventMember } from "@/interfaces/event";

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<EventMember[]>([]);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchEventDetail = async () => {
      if (!id) return;
      try {
        const res = await fetch(`/api/event/${id}`);
        const data = await res.json();
        setEvent(data);

        // Ambil daftar peserta untuk event ini
        const participantsRes = await fetch(`/api/event/${id}/participants`);
        const participantsData = await participantsRes.json();
        setParticipants(participantsData);
      } catch (error) {
        console.error("Gagal mengambil data event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (!event) return <p>Event tidak ditemukan.</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">{event.title}</h1>
      <div className="mb-6">
        <p>
          <strong>Deskripsi:</strong> {event.description}
        </p>
        <p>
          <strong>Tanggal:</strong> {new Date(event.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Lokasi:</strong> {event.location}
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-4">Peserta Event</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Nama Peserta</th>
            <th className="p-2">Tanggal Bergabung</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {participants.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center p-4">
                Tidak ada peserta.
              </td>
            </tr>
          ) : (
            participants.map((participant) => (
              <tr key={participant.id} className="border-t">
                <td className="p-2">{participant.member.name}</td>
                <td className="p-2">
                  {new Date(participant.joined_at).toLocaleDateString()}
                </td>
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
        <button
          onClick={() => router.push("/dashboard/event")}
          className="px-4 py-2 border rounded"
        >
          Kembali ke Daftar Event
        </button>
      </div>
    </div>
  );

  // Fungsi untuk menghapus peserta dari event
  const handleRemoveParticipant = async (participantId: string) => {
    const confirmed = confirm("Yakin ingin menghapus peserta ini?");
    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/event/${id}/participants/${participantId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setParticipants((prevParticipants) =>
          prevParticipants.filter((p) => p.id !== participantId)
        );
      } else {
        alert("Gagal menghapus peserta");
      }
    } catch (error) {
      console.error("Gagal menghapus peserta:", error);
    }
  };
}
