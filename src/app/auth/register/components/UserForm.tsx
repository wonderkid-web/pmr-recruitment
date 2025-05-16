"use client";

import { useState } from "react";
import { Member, Gender, Position } from "@/interfaces/member";

interface MemberFormProps {
  data?: Partial<Member>;
  onSuccess?: () => void;
}

export default function MemberForm({ data, onSuccess }: MemberFormProps) {
  const [form, setForm] = useState<Partial<Member>>({
    id: data?.id,
    name: data?.name ?? "",
    schoolOrigin: data?.schoolOrigin ?? "",
    gender: data?.gender ?? Gender.MALE, // Default ke male
    password: data?.password ?? "",
    birthdate: data?.birthdate, // Tanggal Lahir
    class: data?.class ?? "", // Kelas (contoh: "10 IPA 1")
    position: data?.position ?? Position.ANGGOTA, // Default ke Anggota
    email: data?.email ?? "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = form.id ? "PUT" : "POST";
    const url = `/api/member${form.id ? `/${form.id}` : ""}`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      onSuccess?.();
      history.back();
    } else {
      alert("Gagal menyimpan data member");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Nama"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        type="date"
        placeholder="Tanggal Lahir"
        value={form.birthdate as string}
        onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <select
        value={form.gender}
        onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
        className="w-full border px-3 py-2 rounded"
      >
        <option value={Gender.MALE}>Laki-laki</option>
        <option value={Gender.FEMALE}>Perempuan</option>
      </select>

      <input
        type="text"
        placeholder="Asal Sekolah"
        value={form.schoolOrigin}
        onChange={(e) => setForm({ ...form, schoolOrigin: e.target.value })}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Kelas"
        // value={form.class}
        onChange={(e) => setForm({ ...form, class: e.target.value })}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <select
        value={form.position}
        onChange={(e) =>
          setForm({ ...form, position: e.target.value as Position })
        }
        className="w-full border px-3 py-2 rounded"
      >
        <option value={Position.ANGGOTA}>Anggota</option>
        <option value={Position.KETUA}>Ketua</option>
        <option value={Position.WAKIL_KETUA}>Wakil Ketua</option>
        <option value={Position.SEKRETARIS}>Sekretaris</option>
        <option value={Position.BENDAHARA}>Bendahara</option>
      </select>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => history.back()}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
