import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      participants: {
        include: { member: true },
      },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(event);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const updated = await prisma.event.update({
    where: { id: params.id },
    data: {
      title: body.title,
      description: body.description,
      date: new Date(body.date),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.event.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Event deleted" });
}
