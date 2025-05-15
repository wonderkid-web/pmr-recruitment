"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import Image from "next/image";

export default function MemberLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("id", data.id); // Simpan ID member untuk identifikasi
      localStorage.setItem("name", data.name); // Simpan ID member untuk identifikasi
      localStorage.setItem("email", data.email); // Simpan ID member untuk identifikasi

      Cookies.set("id", data.id);
      Cookies.set("name", data.name);
      Cookies.set("email", data.email);

      if (data.name == "admin") {
        localStorage.setItem("role", "ADMIN"); // Simpan ID member untuk identifikasi
        router.push("/dashboard"); // Ganti dengan halaman utama member kamu
      } else {
        localStorage.setItem("role", "ANGGOTA"); // Simpan ID member untuk identifikasi
        router.push("/dashboard/member-events"); // Ganti dengan halaman utama member kamu
      }
    } else {
      const err = await res.json();
      setError(err.message || "Login gagal");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </div>

        <h1 className="text-xl font-bold mb-4 text-center">Login Member</h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium">Nama</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <small className="mb-5 block">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="text-blue-500">
            Registrasi
          </Link>
        </small>

        <button
          type="submit"
          className={`w-full text-white px-4 py-2 mt-4 rounded hover:bg-blue-700 ${
            !loading ? "bg-blue-600" : "bg-blue-800"
          }`}
          disabled={loading}
        >
          {!loading ? "Login" : "Proses Masuk.."}
        </button>
      </form>
    </div>
  );
}
