"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Schedule } from "@/interfaces/schedule"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarPlus, Download, SquarePen, Trash } from "lucide-react"
import { formatDate } from "@/app/utils/formatDate"
import ScheduleDialog from "./components/ScheduleDialog"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Loader from "@/components/loader/Loader"

export default function SchedulePage() {
  const router = useRouter()

  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const fetchSchedules = async () => {
    try {
      const res = await fetch("/api/schedule")
      const data = await res.json()
      setSchedules(data)
    } catch (error) {
      console.error("Failed to fetch schedules:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const sessionData = sessionStorage.getItem("user")
    console.log(sessionData)

    if (!sessionData) {
      router.replace("/auth/login")
      return
    }

    const session = JSON.parse(sessionData)
    if (session.role !== "ADMIN" && session.role !== "MANAGER") {
      router.replace("/dashboard")
      return
    }

    fetchSchedules()
  }, [])

  const handleEdit = (id: string) => {
    router.push(`/dashboard/schedule/${id}/edit`)
  }

  const exportToExcel = async () => {
    try {
      setExporting(true)

      // Dynamically import the xlsx library
      const XLSX = await import("xlsx")

      // Prepare the data for export
      const exportData = schedules.map((schedule) => ({
        Asset: schedule.asset.name,
        Date: formatDate(schedule.date),
        Type: schedule.type,
        Status: schedule.record?.status === "COMPLETED" ? "Complete" : "Uncomplete",
        Notes: schedule.notes || "-",
      }))

      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData)

      // Create a workbook
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Maintenance Schedules")

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

      // Convert to Blob
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `maintenance_schedules_${new Date().toISOString().split("T")[0]}.xlsx`

      // Trigger download
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to export schedules:", error)
    } finally {
      setExporting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToExcel}
                  disabled={exporting || schedules.length === 0}
                  className="flex items-center gap-1"
                >
                  <Download size={16} />
                  {exporting ? "Exporting..." : "Export to Excel"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download maintenance schedules as Excel file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <button
            onClick={() => router.push("/dashboard/schedule/create")}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <CalendarPlus size={17} /> Add Schedule
          </button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>{schedule.asset.name}</TableCell>
              <TableCell>{formatDate(schedule.date)}</TableCell>
              <TableCell>{schedule.type}</TableCell>
              <TableCell>
                {schedule.record?.status === "COMPLETED" ? (
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-green-500 text-white">Complete</span>
                ) : (
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-red-500 text-white">Uncomplete</span>
                )}
              </TableCell>
              <TableCell>{schedule.notes || "-"}</TableCell>
              <TableCell className="text-right space-x-2">
                <button onClick={() => handleEdit(schedule.id)} className="cursor-pointer">
                  <SquarePen className="text-yellow-400" size={18} />
                </button>
                <button
                  onClick={() => {
                    setSelectedScheduleId(schedule.id)
                    setOpenDialog(true)
                  }}
                  className="cursor-pointer"
                >
                  <Trash className="text-red-300" size={18} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedScheduleId && (
        <ScheduleDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          scheduleId={selectedScheduleId}
          onDeleted={() => {
            fetchSchedules()
          }}
        />
      )}
    </div>
  )
}
