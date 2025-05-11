import { Record } from '@prisma/client'

const baseUrl = '/api/record'

export async function getRecords(): Promise<Record[]> {
  const res = await fetch(baseUrl, {
    cache: "no-store"
  })
  if (!res.ok) throw new Error('Failed to fetch records')
  return res.json()
}

export async function getRecord(id: string): Promise<Record> {
  const res = await fetch(`${baseUrl}/${id}`, {
    cache: "no-store"
  })
  if (!res.ok) throw new Error('Failed to fetch record')
  return res.json()
}

export async function createRecord(data: Partial<Record>) {
  const res = await fetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    cache: "no-store"
  })
  if (!res.ok) throw new Error('Failed to create record')
  return res.json()
}

export async function updateRecord(id: string, data: Partial<Record>) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    cache: "no-store"
  })
  if (!res.ok) throw new Error('Failed to update record')
  return res.json()
}

export async function deleteRecord(id: string) {
  const res = await fetch(`${baseUrl}/${id}`, { 
    method: 'DELETE',  
    cache: "no-store"
  })
  if (!res.ok) throw new Error('Failed to delete record')
  return res.json()
}
