"use client";

import { Member } from "@/interfaces/member";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MemberList() {
  const [members, setMembers] = useState<Member[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await fetch("/api/member");
    const data = await res.json();
    setMembers(data);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/member/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Yakin ingin menghapus data ini?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/member/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error("Gagal hapus member:", err);
    }
  };

  const toggleApproval = async (id: string, status: boolean) => {
    try {
      const res = await fetch(`/api/member/${id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !status }),
      });
      if (res.ok) {
        fetchMembers(); // Refresh data
      }
    } catch (err) {
      console.error("Gagal update status:", err);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Daftar Pendaftar PMR</h1>
      <div className="flex flex-row-reverse mb-3">
        <button
          onClick={() => router.push("/dashboard/member/create")}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg flex justify-center items-center gap-1 cursor-pointer"
        >
          <UserPlus size={17} /> Add Member
        </button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Nama</th>
            <th className="p-2">Jenis Kelamin</th>
            <th className="p-2">Tanggal Lahir</th>
            <th className="p-2">Asal Sekolah</th>
            <th className="p-2">Kelas</th>
            <th className="p-2">Posisi</th>
            <th className="p-2">Bergabung</th>
            <th className="p-2">Status</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-t">
              <td className="p-2">{m.name}</td>
              <td className="p-2">{m.gender}</td>
              <td className="p-2">
                {new Date(m.birthdate).toLocaleDateString()}
              </td>
              <td className="p-2">{m.schoolOrigin}</td>
              <td className="p-2">{m.class}</td>
              <td className="p-2">{m.position}</td>
              <td className="p-2">
                {new Date(m.joined_at).toLocaleDateString()}
              </td>
              <td className="p-2">
                <span
                  className={`text-sm font-medium ${
                    m.status ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {m.status ? "Disetujui" : "Belum"}
                </span>
              </td>
              <td className="p-2 space-x-2">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                  onClick={() => handleEdit(m.id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                  onClick={() => handleDelete(m.id)}
                >
                  Delete
                </button>
                <button
                  className={`${
                    m.status ? "bg-gray-500" : "bg-green-500"
                  } hover:opacity-80 text-white px-2 py-1 rounded text-sm`}
                  onClick={() => toggleApproval(m.id, m.status)}
                >
                  {m.status ? "Tolak" : "Approve"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
