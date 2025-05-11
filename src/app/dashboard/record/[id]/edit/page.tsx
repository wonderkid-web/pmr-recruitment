import { notFound } from "next/navigation";
import RecordForm from "../../components/RecordForm";
import { prisma } from "@/libs/client";
import { Status } from "@/interfaces/status";

export default async function EditRecordPage({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id } = await params;
   const record = await prisma.record.findUnique({
      where: { id },
   });

   if (!record) return notFound();

   return (
      <div className="p-6">
         <h1 className="text-2xl font-bold mb-4">Edit Record</h1>
         <RecordForm
            data={{
               id: record.id,
               schedule_id: record.schedule_id ?? "",
               performed_by: record.performed_by,
               performed_date: record.performed_date.toISOString().slice(0, 16),
               findings: record.findings ?? "",
               action_taken: record.action_taken ?? "",
               status: record.status as Status,
            }}
         />
      </div>
   );
}
