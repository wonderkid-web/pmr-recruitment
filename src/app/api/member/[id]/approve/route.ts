import { prisma } from '@/libs/client'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const { status } = await req.json()

  try {
    const updated = await prisma.member.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: "Gagal update status" }, { status: 500 })
  }
}
