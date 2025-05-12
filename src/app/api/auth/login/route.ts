import { prisma } from "@/libs/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  console.log(email, password)

  const member = await prisma.member.findFirst({
    where: { email, password, status: true },
  });

  if (!member) {
    return NextResponse.json(
      { message: "Nama atau password salah, atau akun belum di-approve" },
      { status: 401 }
    );
  }

  return NextResponse.json({ id: member.id, name: member.name });
}
