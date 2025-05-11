"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FilePlus, SquarePen, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Record } from "@/interfaces/record"
import RecordDialog from "./components/RecordDialog"
import { formatDate } from "@/app/utils/formatDate"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Loader from "@/components/loader/Loader"

export default function RecordPage() {
  const router = useRouter()

  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/record")
      const data = await res.json()
      setRecords(data)
    } catch (error) {
      console.error("Failed to fetch records:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const sessionData = sessionStorage.getItem("user")

    if (!sessionData) {
      router.replace("/auth/login")
      return
    }

    const session = JSON.parse(sessionData)
    if (session.role !== "ADMIN" && session.role !== "MEMBER") {
      router.replace("/dashboard")
      return
    }

    fetchRecords()
  }, [])

  const handleEdit = (id: string) => {
    router.push(`/dashboard/record/${id}/edit`)
  }

  const exportToExcel = async () => {
    try {
      setExporting(true)

      // Dynamically import the xlsx library
      const XLSX = await import("xlsx")

      // Prepare the data for export
      const exportData = records.map((record) => ({
        "Performed By": record.performed_by,
        Date: formatDate(record.performed_date),
        Status: record.status,
        Details: record.status || "-",
      }))

      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData)

      // Create a workbook
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Maintenance Records")

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
      link.download = `maintenance_records_${new Date().toISOString().split("T")[0]}.xlsx`

      // Trigger download
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to export records:", error)
    } finally {
      setExporting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Maintenance Records</h1>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToExcel}
                  disabled={exporting || records.length === 0}
                  className="flex items-center gap-1"
                >
                  <Download size={16} />
                  {exporting ? "Exporting..." : "Export to Excel"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download maintenance records as Excel file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <button
            onClick={() => router.push("/dashboard/record/create")}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg flex gap-1 items-center cursor-pointer"
          >
            <FilePlus size={17} /> Add Record
          </button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Performed By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.performed_by}</TableCell>
              <TableCell>{formatDate(record.performed_date)}</TableCell>
              <TableCell>
                <Badge
                  className={
                    record.status === "COMPLETED"
                      ? "bg-green-500 text-white"
                      : record.status === "PENDING"
                        ? "bg-yellow-400 text-black"
                        : "bg-orange-500 text-white"
                  }
                >
                  {record.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <button onClick={() => handleEdit(record.id)} className="cursor-pointer">
                  <SquarePen className="text-yellow-400" size={18} />
                </button>
                <button
                  className="ml-2 cursor-pointer"
                  onClick={() => {
                    setSelectedId(record.id)
                    setOpenDialog(true)
                  }}
                >
                  <Trash className="text-red-400" size={18} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedId && (
        <RecordDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          recordId={selectedId}
          onDeleted={fetchRecords}
        />
      )}
    </div>
  )
}
