import { prisma } from "@/libs/client";
import { notFound } from "next/navigation";
import ScheduleForm from "../../components/ScheduleForm";

export default async function EditSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const schedule = await prisma.schedule.findUnique({
    where: { id },
  });

  if (!schedule) return notFound();

  return (
    <div className="max-w-lg mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-4">Edit Schedule</h1>
      <ScheduleForm
        data={{
          ...schedule,
          date: schedule.date.toISOString(),
          notes: schedule.notes ?? undefined,
        }}
      />
    </div>
  );
}
