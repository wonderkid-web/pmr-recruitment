import { prisma } from '@/libs/client'
import { NextRequest, NextResponse } from 'next/server'

function getIdFromUrl(req: NextRequest) {
  const segments = req.nextUrl.pathname.split('/')
  return segments[segments.length - 1]
}

export async function GET(req: NextRequest) {
  const id = getIdFromUrl(req)

  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: { asset: true, record: true },
  })

  if (!schedule) {
    return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
  }

  return NextResponse.json(schedule)
}

export async function PUT(req: NextRequest) {
  const id = getIdFromUrl(req)
  const data = await req.json()

  const schedule = await prisma.schedule.update({
    where: { id },
    data: {
      date: new Date(data.date),
      type: data.type,
      notes: data.notes || undefined,
      asset: {
        connect: {
          id: data.asset_id,
        },
      },
    },
  })

  return NextResponse.json(schedule)
}

export async function DELETE(req: NextRequest) {
  const id = getIdFromUrl(req)

  await prisma.schedule.delete({
    where: { id },
  })

  return NextResponse.json({ message: 'Schedule deleted' })
}