import { prisma } from "@/libs/client";
import { notFound } from "next/navigation";
import UseForm from "../../components/UserForm";
import { Gender, Position } from "@/interfaces/member";

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const member = await prisma.member.findUnique({ where: { id } });

  if (!member) return notFound();

  const formattedMember = {
    ...member,
    birthdate: member.birthdate.toISOString().split("T")[0],
    gender: member.gender as Gender,
    position: member.position as Position,
  };

  return (
    <div className="max-w-lg mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-4">Edit Member</h1>
      <UseForm data={formattedMember} />
    </div>
  );
}
