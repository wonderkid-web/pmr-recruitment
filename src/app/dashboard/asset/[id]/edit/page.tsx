import AssetForm from "../../components/AssetForm";
import { notFound } from "next/navigation";

type Props = Promise<{
  params: { id: string };
}>;

export default async function EditAssetPage({ params }: { params: Props }) {
  const id = (await params).params.id;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/asset/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return notFound();

    const asset = await res.json();

    return (
      <div className="max-w-lg mx-auto mt-6">
        <h1 className="text-2xl font-semibold mb-4">Edit Asset</h1>
        <AssetForm
          data={{
            ...asset,
            description: asset.description ?? "",
          }}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching asset:", error);
    return notFound();
  }
}
