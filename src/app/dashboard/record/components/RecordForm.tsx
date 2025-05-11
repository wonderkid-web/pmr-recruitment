"use client"

import { formatDate } from "@/app/utils/formatDate"
import { Record } from "@/interfaces/record"
import { Schedule } from "@/interfaces/schedule"
import { Status } from "@/interfaces/status"
import { useEffect, useState } from "react"

interface RecordFormProps {
   data?: Partial<Record>
   onSuccess?: () => void
}

export default function RecordForm({ data, onSuccess }: RecordFormProps) {
   const [form, setForm] = useState<Partial<Record>>({
      id: data?.id,
      schedule_id: data?.schedule_id ?? "",
      performed_date: data?.performed_date ?? "",
      performed_by: data?.performed_by ?? "",
      findings: data?.findings ?? "",
      action_taken: data?.action_taken ?? "",
      status: data?.status ?? Status.PENDING,
   })

   const [loading, setLoading] = useState(false)
   const [schedules, setSchedules] = useState<Schedule[]>([])

   useEffect(() => {
      const fetchSchedules = async () => {
         const res = await fetch("/api/schedule")
         const data = await res.json()
         setSchedules(data)
      }

      fetchSchedules()
   }, [])

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)

      const method = form.id ? "PUT" : "POST"
      const url = `/api/record${form.id ? `/${form.id}` : ""}`

      const res = await fetch(url, {
         method,
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            ...form,
            performed_date: new Date(),
            schedule_id: form.schedule_id || undefined,
         }),
      })

      if (res.ok) {
         onSuccess?.()
         history.back()
      } else {
         alert("Gagal menyimpan record")
      }

      setLoading(false)
   }

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         <select
            value={form.schedule_id}
            onChange={(e) => setForm({ ...form, schedule_id: e.target.value })}
            className="w-full border px-3 py-2 rounded"
         >
            <option value="">Pilih Jadwal</option>
            {schedules.map((s) => (
               <option key={s.id} value={s.id}>
                  {formatDate(s.date)}
               </option>
            ))}
         </select>

         {/* <input
            type="datetime-local"
            required
            value={form.performed_date}
            onChange={(e) => setForm({ ...form, performed_date: e.target.value })}
            className="w-full border px-3 py-2 rounded"
         /> */}

         <input
            type="text"
            placeholder="Performed By"
            value={form.performed_by}
            onChange={(e) => setForm({ ...form, performed_by: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
         />

         <textarea
            placeholder="Findings (optional)"
            value={form.findings}
            onChange={(e) => setForm({ ...form, findings: e.target.value })}
            className="w-full border px-3 py-2 rounded"
         />

         <textarea
            placeholder="Action Taken (optional)"
            value={form.action_taken}
            onChange={(e) => setForm({ ...form, action_taken: e.target.value })}
            className="w-full border px-3 py-2 rounded"
         />

         <select
            required
            value={form.status}
            onChange={(e) =>
               setForm({ ...form, status: e.target.value as Record["status"] })
            }
            className="w-full border px-3 py-2 rounded"
         >
            <option value="PENDING">Pending</option>
            <option value="NEED_FOLLOW_UP">Need Follow Up</option>
            <option value="COMPLETED">Completed</option>
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