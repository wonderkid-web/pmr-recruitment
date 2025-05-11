// src/app/api/asset/[id]/route.ts
import { prisma } from '@/libs/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const id = url.pathname.split("/").pop()

  if (!id) {
    return NextResponse.json({ error: "Asset ID is required" }, { status: 400 })
  }

  const asset = await prisma.asset.findUnique({
    where: { id },
    include: { schedules: true },
  })

  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 })
  }

  return NextResponse.json(asset)
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url)
  const id = url.pathname.split("/").pop()

  if (!id) {
    return NextResponse.json({ error: "Asset ID is required" }, { status: 400 })
  }

  const data = await req.json()

  try {
    const asset = await prisma.asset.update({
      where: { id },
      data,
    })

    return NextResponse.json(asset)
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update asset" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url)
  const id = url.pathname.split("/").pop()

  if (!id) {
    return NextResponse.json({ error: "Asset ID is required" }, { status: 400 })
  }

  try {
    await prisma.asset.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Asset deleted successfully" })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 })
  }
}