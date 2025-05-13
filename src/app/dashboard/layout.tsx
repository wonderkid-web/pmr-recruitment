"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
   SidebarInset,
   SidebarProvider,
   SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
   children,
}: {
   children: React.ReactNode
}) {
   const router = useRouter()
   const [user, setUser] = useState<null | {
      name: string
      email: string
   }>(null)

   useEffect(() => {
      const stored = localStorage.getItem("id")
      const name = localStorage.getItem("name")!
      const email = localStorage.getItem("email")!

      setUser({
         name, email
      })

      console.log(stored)

      if (!stored) {
         router.push("/auth/login")
         return
      }

      // try {
      //    const parsed = JSON.parse(stored)
      //    setUser(parsed)
      // } catch {
      //    localStorage.removeItem("id")
      //    localStorage.removeItem("name")
      //    localStorage.removeItem("role")
      //    localStorage.removeItem("email")

      //    // router.push("/auth/login")
      // }
   }, [router])


   if (!user) return null

   return (
      <SidebarProvider>
         <AppSidebar />
         <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
               <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
               </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="min-h-screen bg-gray-50">{children}</div>
            </main>
         </SidebarInset>
      </SidebarProvider>
   )
}

