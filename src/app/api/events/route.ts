// app/api/events/route.ts
import { prisma } from '@/libs/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        participants: {
          include: {
            member: true, // sertakan data member dari peserta event
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
