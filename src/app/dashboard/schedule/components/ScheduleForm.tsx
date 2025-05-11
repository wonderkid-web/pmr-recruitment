"use client"

import { useState, useEffect } from "react"
import { Schedule } from "@/interfaces/schedule"
import { Type } from "@prisma/client"

interface ScheduleFormProps {
   data?: Partial<Schedule>
   onSuccess?: () => void
}

export default function ScheduleForm({ data, onSuccess }: ScheduleFormProps) {
   const [assets, setAssets] = useState<{ id: string; name: string }[]>([])
   const [form, setForm] = useState({
      id: data?.id,
      asset_id: data?.asset_id || "",
      date: data?.date?.slice(0, 16) || "",
      type: data?.type || Type.PREVENTIVE,
      notes: data?.notes || "",
   })

   const [loading, setLoading] = useState(false)

   useEffect(() => {
      fetch("/api/asset")
         .then(res => res.json())
         .then(setAssets)
   }, [])

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)

      const res = await fetch(`/api/schedule${form.id ? `/${form.id}` : ""}`, {
         method: form.id ? "PUT" : "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(form),
      })

      if (res.ok) {
         onSuccess?.()
         history.back()
      } else {
         alert("Failed to save schedule")
      }

      setLoading(false)
   }

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         <select
            required
            value={form.asset_id}
            onChange={(e) => setForm({ ...form, asset_id: e.target.value })}
            className="w-full border px-3 py-2 rounded"
         >
            <option value="">Select Asset</option>
            {assets.map(asset => (
               <option key={asset.id} value={asset.id}>{asset.name}</option>
            ))}
         </select>

         <input
            type="datetime-local"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
         />

         <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as Type })}
            className="w-full border px-3 py-2 rounded"
         >
            <option value="PREVENTIVE">Preventive</option>
            <option value="CORRECTIVE">Corrective</option>
            <option value="EMERGENCY">Emergency</option>
         </select>

         <textarea
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
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