"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { User } from "@/interfaces/user"
import { Download, SquarePen, Trash, UserRoundPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import UserDialog from "./components/UserDialog"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Loader from "@/components/loader/Loader"

export default function UserPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const sessionData = sessionStorage.getItem("user")

    if (!sessionData) {
      router.replace("/auth/login")
      return
    }

    const session = JSON.parse(sessionData)
    if (session.role !== "ADMIN") {
      router.replace("/dashboard")
      return
    }

    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/user", { method: "GET" })
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/dashboard/user/${id}/edit`)
  }

  const exportToExcel = async () => {
    try {
      setExporting(true)

      // Dynamically import the xlsx library
      const XLSX = await import("xlsx")

      // Prepare the data for export
      const exportData = users.map((user) => ({
        Name: user.name,
        Email: user.email,
        Role: user.role,
      }))

      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData)

      // Create a workbook
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users")

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
      link.download = `users_${new Date().toISOString().split("T")[0]}.xlsx`

      // Trigger download
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to export users:", error)
    } finally {
      setExporting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToExcel}
                  disabled={exporting || users.length === 0}
                  className="flex items-center gap-1"
                >
                  <Download size={16} />
                  {exporting ? "Exporting..." : "Export to Excel"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download user data as Excel file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <button
            onClick={() => router.push("/dashboard/user/create")}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg flex justify-center items-center gap-1 cursor-pointer"
          >
            <UserRoundPlus size={17} /> Add User
          </button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="text-right">
                <button onClick={() => handleEdit(user.id)} className="cursor-pointer">
                  <SquarePen className="text-yellow-300" size={18} />
                </button>
                <button
                  className="ml-2 cursor-pointer"
                  onClick={() => {
                    setSelectedUserId(user.id)
                    setOpenDialog(true)
                  }}
                >
                  <Trash className="text-red-300" size={18} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedUserId && (
        <UserDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          userId={selectedUserId}
          onDeleted={() => {
            fetchUsers()
          }}
        />
      )}
    </div>
  )
}
