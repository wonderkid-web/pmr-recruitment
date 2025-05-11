import { prisma } from '@/libs/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const schedules = await prisma.schedule.findMany({
    include: { asset: true, record: true },
  })
  return NextResponse.json(schedules)
}

export async function POST(req: NextRequest) {
  const data = await req.json()

  const schedule = await prisma.schedule.create({
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