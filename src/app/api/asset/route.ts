// src/app/api/asset/route.ts
import { prisma } from '@/libs/client'
import { NextRequest, NextResponse } from 'next/server'

// GET all assets
export async function GET() {
  const assets = await prisma.asset.findMany({
    include: { schedules: true },
  })
  return NextResponse.json(assets)
}

// POST create asset
export async function POST(req: NextRequest) {
  const data = await req.json()

  const asset = await prisma.asset.create({
    data,
  })

  return NextResponse.json(asset)
}
