import { prisma } from '@/libs/client'
import { Status } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const id = req.url.split('/').pop()
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

  const record = await prisma.record.findUnique({
    where: { id },
    include: { schedule: true },
  })

  if (!record) {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 })
  }

  return NextResponse.json(record)
}

export async function PUT(req: NextRequest) {
  const id = req.url.split('/').pop()
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

  const body = await req.json()

  const record = await prisma.record.update({
    where: { id },
    data: {
      schedule_id: body.schedule_id || undefined,
      performed_date: new Date(body.performed_date),
      performed_by: body.performed_by,
      findings: body.findings || undefined,
      action_taken: body.action_taken || undefined,
      status: body.status as Status,
    },
  })

  return NextResponse.json(record)
}

export async function DELETE(req: NextRequest) {
  const id = req.url.split('/').pop()
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

  await prisma.record.delete({
    where: { id },
  })

  return NextResponse.json({ message: 'Record deleted' })
}