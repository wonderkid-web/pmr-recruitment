"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Props {
   open: boolean
   onClose: () => void
   recordId: string
   onDeleted: () => void
}

export default function RecordDialog({ open, onClose, recordId, onDeleted }: Props) {
   const handleDelete = async () => {
      await fetch(`/api/record/${recordId}`, { method: "DELETE" })
      onClose()
      onDeleted()
   }

   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this record?</p>
            <DialogFooter>
               <Button variant="outline" onClick={onClose}>
                  Cancel
               </Button>
               <Button variant="destructive" onClick={handleDelete}>
                  Delete
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}