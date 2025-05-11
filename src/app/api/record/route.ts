import { prisma } from "@/libs/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const records = await prisma.record.findMany({
    include: { schedule: true },
  });
  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.schedule_id) {
    return new NextResponse("Schedule is required", { status: 400 });
  }

  const schedule = await prisma.schedule.findUnique({
    where: { id: body.schedule_id },
    select: { asset_id: true },
  });

  if (!schedule) {
    return new NextResponse("Schedule not found", { status: 404 });
  }

  const record = await prisma.record.create({
    data: {
      schedule_id: body.schedule_id,
      performed_date: new Date(body.performed_date),
      performed_by: body.performed_by,
      findings: body.findings || undefined,
      action_taken: body.action_taken || undefined,
      status: body.status,
    },
  });

  return NextResponse.json(record);
}
