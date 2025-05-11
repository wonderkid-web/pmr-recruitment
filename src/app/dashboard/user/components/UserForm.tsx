"use client"

import { useState } from "react"
import { Role } from "@/interfaces/role"
import { User } from "@/interfaces/user"

interface UserFormProps {
   data?: Partial<User>
   onSuccess?: () => void
}

export default function UserForm({ data, onSuccess }: UserFormProps) {
   const [form, setForm] = useState<Partial<User>>({
      id: data?.id,
      name: data?.name ?? "",
      email: data?.email ?? "",
      password: "",
      role: data?.role ?? Role.MEMBER,
   })

   const [loading, setLoading] = useState(false)

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)

      const method = form.id ? "PUT" : "POST"
      const url = `/api/user${form.id ? `/${form.id}` : ""}`

      const res = await fetch(url, {
         method,
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(form),
      })

      if (res.ok) {
         onSuccess?.()
         history.back()
      } else {
         alert("Gagal menyimpan user")
      }

      setLoading(false)
   }

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
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
         {!form.id && (
            <input
               type="password"
               placeholder="Password"
               value={form.password}
               onChange={(e) => setForm({ ...form, password: e.target.value })}
               className="w-full border px-3 py-2 rounded"
               required
            />
         )}
         <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            className="w-full border px-3 py-2 rounded"
         >
            {Object.keys(Role)
               .filter((key) => isNaN(Number(key)))
               .map((key) => (
                  <option key={key} value={Role[key as keyof typeof Role]}>
                     {key.charAt(0) + key.slice(1).toLowerCase()}
                  </option>
               ))}
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
               {loading ? "Saving..." : "Save"}
            </button>
         </div>
      </form>
   )
}