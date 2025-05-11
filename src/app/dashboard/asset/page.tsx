"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, PackagePlus, SquarePen, Trash } from "lucide-react"
import { formatDate } from "@/app/utils/formatDate"
import { useRouter } from "next/navigation"
import AssetDialog from "./components/AssetDialog"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Loader from "@/components/loader/Loader"

interface Asset {
  id: string
  name: string
  type: string
  location: string
  description?: string
  created_at: string
}

export default function AssetPage() {
  const router = useRouter()

  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const fetchAssets = async () => {
    try {
      const res = await fetch("/api/asset", { method: "GET" })
      const data = await res.json()
      console.log(data)
      setAssets(data)
    } catch (error) {
      console.error("Failed to fetch assets:", error)
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
    if (session.role !== "ADMIN") {
      router.replace("/dashboard")
      return
    }

    fetchAssets()
  }, [])

  const handleEdit = (id: string) => {
    router.push(`/dashboard/asset/${id}/edit`)
  }

  const exportToExcel = async () => {
    try {
      setExporting(true)

      // Dynamically import the xlsx library
      const XLSX = await import("xlsx")

      // Prepare the data for export
      const exportData = assets.map((asset) => ({
        Name: asset.name,
        Type: asset.type,
        Location: asset.location,
        Description: asset.description || "-",
        "Created At": formatDate(asset.created_at),
      }))

      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData)

      // Create a workbook
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Assets")

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
      link.download = `assets_${new Date().toISOString().split("T")[0]}.xlsx`

      // Trigger download
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to export assets:", error)
    } finally {
      setExporting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Asset Management</h1>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToExcel}
                  disabled={exporting || assets.length === 0}
                  className="flex items-center gap-1"
                >
                  <Download size={16} />
                  {exporting ? "Exporting..." : "Export to Excel"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download asset data as Excel file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <button
            onClick={() => router.push("/dashboard/asset/create")}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg flex justify-center items-center gap-1 cursor-pointer"
          >
            <PackagePlus size={17} /> Add Asset
          </button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{asset.type}</TableCell>
              <TableCell>{asset.location}</TableCell>
              <TableCell>{asset.description ?? "-"}</TableCell>
              <TableCell>{formatDate(asset.created_at)}</TableCell>
              <TableCell className="text-right space-x-2">
                <button onClick={() => handleEdit(asset.id)} className="cursor-pointer">
                  <SquarePen className="text-yellow-300" size={18} />
                </button>
                <button
                  onClick={() => {
                    setSelectedAssetId(asset.id)
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
      {selectedAssetId && (
        <AssetDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          assetId={selectedAssetId}
          onDeleted={() => {
            fetchAssets()
          }}
        />
      )}
    </div>
  )
}
