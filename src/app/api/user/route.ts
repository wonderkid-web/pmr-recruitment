import { prisma } from '@/libs/client'
import { hash } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const users = await prisma.user.findMany()
  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const hashedPassword = await hash(body.password, 10)

   const user = await prisma.user.create({
      data: {
         name: body.name,
         email: body.email,
         password: hashedPassword,
         role: body.role,
      },
   })

  return NextResponse.json(user)
}
