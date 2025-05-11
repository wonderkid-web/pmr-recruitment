"use client"

import { Asset } from "@/interfaces/asset"
import { useState } from "react"

interface AssetFormProps {
   data?: Partial<Asset>
   onSuccess?: () => void
}

export default function AssetForm({ data, onSuccess }: AssetFormProps) {
   const [form, setForm] = useState<Partial<Asset>>({
      id: data?.id,
      name: data?.name || "",
      type: data?.type || "",
      location: data?.location || "",
      description: data?.description || "",
   })

   const [loading, setLoading] = useState(false)

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)

      const res = await fetch(`/api/asset${form.id ? `/${form.id}` : ""}`, {
         method: form.id ? "PUT" : "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(form),
      })

      if (res.ok) {
         onSuccess?.()
         history.back()
      } else {
         alert("Failed to save asset")
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
            type="text"
            placeholder="Asset Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
         />
         <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
         />
         <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border px-3 py-2 rounded"
         />
         <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => history.back()} className="px-4 py-2 border rounded">
               Cancel
            </button>
            <button
               type="submit"
               disabled={loading}
               className="px-4 py-2 bg-blue-600 text-white rounded"
            >
               {loading ? "Saving..." : "Save"}
            </button>
         </div>
      </form>
   )
}