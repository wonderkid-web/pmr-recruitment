import EventForm from "../components/EventForm"

export default function CreateSchedulePage() {
   return (
      <div className="max-w-lg mx-auto mt-6">
         <h1 className="text-2xl font-semibold mb-4">Create Schedule</h1>
         <EventForm />
      </div>
   )
}