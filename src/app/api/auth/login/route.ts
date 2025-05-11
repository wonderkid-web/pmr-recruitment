import { prisma } from "@/libs/client"
import { compare } from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
   const { email, password } = await req.json()

   const user = await prisma.user.findUnique({ where: { email } })

   if (!user || !(await compare(password, user.password))) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
   }

   const response = NextResponse.json({
      data: {
      name: user.name,
      email: user.email,
      role: user.role,
      },
   })

   response.cookies.set("role", user.role, { path: "/" })

   return response
}