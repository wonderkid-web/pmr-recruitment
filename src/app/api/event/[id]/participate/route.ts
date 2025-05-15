import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/libs/client";


export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;

    // Get memberId from cookie
    const cookieStore = cookies();
    const memberId = (await cookieStore).get("id")?.value;
    console.log("cookies id", memberId);

    if (!memberId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Check if already participating
    const existingParticipation = await prisma.eventMember.findUnique({
      where: {
        eventId_memberId: {
          eventId,
          memberId,
        },
      },
    });

    if (existingParticipation) {
      return NextResponse.json(
        { error: "Already participating in this event" },
        { status: 400 }
      );
    }

    // Create participation record
    const participation = await prisma.eventMember.create({
      data: {
        eventId,
        memberId,
      },
    });

    return NextResponse.json(participation);
  } catch (error) {
    console.error("Error joining event:", error);
    return NextResponse.json(
      { error: "Failed to join event" },
      { status: 500 }
    );
  }
}
