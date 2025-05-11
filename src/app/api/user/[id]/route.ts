import { prisma } from '@/libs/client'
import { NextRequest, NextResponse } from 'next/server'

function getIdFromUrl(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split('/')
  return segments[segments.length - 1]
}

export async function GET(req: NextRequest) {
  const id = getIdFromUrl(req)

  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PUT(req: NextRequest) {
  const id = getIdFromUrl(req)
  const body = await req.json()

  const user = await prisma.user.update({
    where: { id },
    data: {
      name: body.name,
      email: body.email,
      role: body.role,
    },
  })

  return NextResponse.json(user)
}

export async function DELETE(req: NextRequest) {
  const id = getIdFromUrl(req)

  await prisma.user.delete({
    where: { id },
  })

  return NextResponse.json({ message: 'User deleted' })
}