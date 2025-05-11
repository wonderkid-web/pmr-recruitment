import AssetForm from "../components/AssetForm";

export default function CreateAssetPage() {
   return (
      <div className="max-w-lg mx-auto mt-6">
         <h1 className="text-2xl font-semibold mb-4">Create Asset</h1>
         <AssetForm />
      </div>
   )
}