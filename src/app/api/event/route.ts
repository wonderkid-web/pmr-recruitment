import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/client";

// GET: Ambil semua event
export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
  });
  return NextResponse.json(events);
}

// POST: Buat event baru
export async function POST(req: NextRequest) {
  const body = await req.json();

  const event = await prisma.event.create({
    data: {
      title: body.title,
      description: body.description,
      date: new Date(body.date),
    },
  });

  return NextResponse.json(event, { status: 201 });
}
