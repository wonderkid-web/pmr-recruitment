import { prisma } from '@/libs/client'
import { NextRequest, NextResponse } from 'next/server'

// GET: Ambil semua member
export async function GET() {
  const members = await prisma.member.findMany()
  return NextResponse.json(members)
}

// POST: Tambah member baru
export async function POST(req: NextRequest) {
  const body = await req.json()

  try {
    const member = await prisma.member.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
        gender: body.gender, // Pastikan gender berupa enum yang valid
        birthdate: new Date(body.birthdate),
        class: body.class,
        position: body.position ?? 'ANGGOTA',
        // status default (false), joined_at dan timestamps otomatis
      },
    })

    return NextResponse.json(member)
  } catch (error) {
    console.error("Gagal membuat member:", error)
    return NextResponse.json({ error: "Gagal membuat member" }, { status: 500 })
  }
}
