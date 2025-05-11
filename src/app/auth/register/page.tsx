"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
   const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
   })
   const [loading, setLoading] = useState(false)
   const router = useRouter()

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)

      const res = await fetch("/api/auth/register", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ ...form, role: "MEMBER" }),
      })

      if (res.ok) {
         router.push("/auth/login")
      } else {
         alert("Registration failed")
      }
      setLoading(false)
   }

   return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
         <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4">
            <h1 className="text-center text-2xl font-bold">Register</h1>
            <input
               type="text"
               placeholder="Name"
               value={form.name}
               onChange={(e) => setForm({ ...form, name: e.target.value })}
               className="w-full border px-3 py-2 rounded"
               required
            />
            <input
               type="email"
               placeholder="Email"
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

            <small className="mb-5">Sudah punya akun? <Link href="/auth/login" className="text-blue-500">Login</Link></small>

            <div className="flex justify-between mt-3">
               <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
                  disabled={loading}
               >
                  {loading ? "Registering..." : "Register"}
               </button>
            </div>
         </form>
      </div>
   )
}