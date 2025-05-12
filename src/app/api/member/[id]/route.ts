import { prisma } from '@/libs/client'
import { NextRequest, NextResponse } from 'next/server'

function getIdFromUrl(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split('/')
  return segments[segments.length - 1]
}

export async function GET(req: NextRequest) {
  const id = getIdFromUrl(req)

  const member = await prisma.member.findUnique({
    where: { id },
  })

  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }

  return NextResponse.json(member)
}

export async function PUT(req: NextRequest) {
  const id = getIdFromUrl(req)
  const body = await req.json()

  const member = await prisma.member.update({
    where: { id },
    data: {
      name: body.name,
      gender: body.gender,
      birthdate: new Date(body.birthdate),
      class: body.class,
      position: body.position,
    },
  })

  return NextResponse.json(member)
}

export async function DELETE(req: NextRequest) {
  const id = getIdFromUrl(req)

  await prisma.member.delete({
    where: { id },
  })

  return NextResponse.json({ message: 'Member deleted' })
}
