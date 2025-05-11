"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
   const router = useRouter()
   const [loading, setLoading] = useState(false)
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [error, setError] = useState("")

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")
      setLoading(true)
      try {

         const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            cache: "no-store"
         })

         const data = await res.json()

         if (res.ok) {
            sessionStorage.setItem("user", JSON.stringify(data.data))
            router.push("/dashboard")
         } else {
            setError(data.message || "Login gagal")
         }
      } catch (err) {
         console.error("Login error:", err)
         setError("Terjadi kesalahan saat login.")
      }finally{
         setLoading(false)
      }
   }

   return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">

         <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4">
            <h1 className="text-center text-2xl font-bold">Login</h1>
            <div className="space-y-2">
               <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
               />
               {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

               <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
               />
               {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            </div>

            <small className="mb-5">Belum punya akun? <Link href="/auth/register" className="text-blue-500">Registrasi</Link></small>

            <button
               type="submit"
               className={`w-full text-white px-4 py-2 mt-4 rounded hover:bg-blue-700 ${!loading ? 'bg-blue-600' : 'bg-blue-800'}`}
               disabled={loading}

            >
               {!loading && "Login"}
               {loading && "Proses Masuk.."}
               
            </button>
         </form>
      </div>
   )
}