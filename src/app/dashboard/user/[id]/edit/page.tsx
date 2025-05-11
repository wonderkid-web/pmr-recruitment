import { prisma } from "@/libs/client"
import { notFound } from "next/navigation"
import UserForm from "../../components/UserForm"

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
   const {id} = await params
   const user = await prisma.user.findUnique({ where: { id } })

   if (!user) return notFound()

   return (
      <div className="max-w-lg mx-auto mt-6">
         <h1 className="text-2xl font-semibold mb-4">Edit User</h1>
         <UserForm data={user} />
      </div>
   )
}