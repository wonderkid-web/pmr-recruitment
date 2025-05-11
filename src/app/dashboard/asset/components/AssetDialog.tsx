"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface AssetDialogProps {
   open: boolean
   onClose: () => void
   assetId: string
   onDeleted: () => void
}

export default function AssetDialog({ open, onClose, assetId, onDeleted }: AssetDialogProps) {
   const [loading, setLoading] = useState(false)

   const handleDelete = async () => {
      setLoading(true)
      const res = await fetch(`/api/asset/${assetId}`, { method: "DELETE" })

      if (res.ok) {
         onDeleted()
         onClose()
      } else {
         alert("Failed to delete user")
      }

      setLoading(false)
   }

   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this asset?</p>
            <DialogFooter className="mt-4">
               <Button variant="outline" onClick={onClose} className="cursor-pointer">Cancel</Button>
               <Button variant="destructive" onClick={handleDelete} disabled={loading} className="cursor-pointer">
                  {loading ? "Deleting..." : "Delete"}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}