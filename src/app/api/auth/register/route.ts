import { prisma } from "@/libs/client"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password)
    return NextResponse.json({ message: "Invalid input" }, { status: 400 })

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing)
    return NextResponse.json({ message: "Email already registered" }, { status: 409 })

  const hashed = await hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: "MEMBER",
    },
  })

  return NextResponse.json({ message: "Registration successful", data: user })
}