import UserForm from "../components/UserForm"

export default function CreateStudentPage() {
   return (
      <div className="max-w-lg mx-auto mt-6">
         <h1 className="text-2xl font-semibold mb-4">Create New Member</h1>
         <UserForm />
      </div>
   )
}