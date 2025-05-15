import { prisma } from '@/libs/client'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const {id} = await params
  const { status } = await req.json()

  try {
    const updated = await prisma.member.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Gagal update status" + error}, { status: 500 })
  }
}
