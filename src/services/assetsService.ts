import { Asset } from '@prisma/client'

export async function getAssets(): Promise<Asset[]> {
  const res = await fetch('/api/asset', {
    cache: "no-store"
  })
  return res.json()
}

export async function createAsset(data: Partial<Asset>) {
  const res = await fetch('/api/asset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    cache: "no-store"
  })
  return res.json()
}

export async function updateAsset(id: string, data: Partial<Asset>) {
  const res = await fetch(`/api/asset/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    cache: "no-store"
  })
  return res.json()
}

export async function deleteAsset(id: string) {
  const res = await fetch(`/api/asset/${id}`, {
    method: 'DELETE',
    cache: "no-store"
  })
  return res.json()
}
