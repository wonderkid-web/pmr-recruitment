import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/client"; // pastikan path ini sesuai dengan konfigurasi prisma client kamu

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: memberId } = await params;

  if (!memberId) {
    return NextResponse.json(
      { message: "Member ID is required" },
      { status: 400 }
    );
  }

  try {
    const participations = await prisma.eventMember.findMany({
      where: {
        memberId,
      },
      select: {
        eventId: true,
      },
    });

    return NextResponse.json(participations, { status: 200 });
  } catch (error) {
    console.error("[GET_PARTICIPATIONS]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
