"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
}

export default function EventListAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch("/api/event");
      const data = await res.json();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Yakin ingin menghapus event ini?");
    if (!confirmed) return;

    const res = await fetch(`/api/event/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Daftar Event PMR</h1>

      <div className="flex flex-row-reverse mb-3">
        <button
          onClick={() => router.push("/dashboard/event/create")}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg flex items-center gap-1"
        >
          <Plus size={17} /> Tambah Event
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Judul</th>
            <th className="p-2">Deskripsi</th>
            <th className="p-2">Tanggal</th>
            <th className="p-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-t">
              <td className="p-2 font-medium">{event.title}</td>
              <td className="p-2">{event.description}</td>
              <td className="p-2">
                {new Date(event.date).toLocaleDateString("id-ID")}
              </td>
              <td className="p-2 space-x-2 flex gap-2 mx-auto justify-center">
                <button
                  onClick={() => router.push(`/dashboard/event/${event.id}`)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                >
                  <Eye size={16} /> Detail
                </button>
                <button
                  onClick={() => router.push(`/dashboard/event/${event.id}/edit`)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
