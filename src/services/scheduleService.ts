import { Schedule } from '@prisma/client'

const baseUrl = '/api/schedule'

export async function getSchedules(): Promise<Schedule[]> {
  const res = await fetch(baseUrl, {
    cache: "no-store"
  })
  if (!res.ok) throw new Error('Failed to fetch schedules')
  return res.json()
}

export async function getSchedule(id: string): Promise<Schedule> {
  const res = await fetch(`${baseUrl}/${id}`, {
    cache: "no-store"
  })
  if (!res.ok) throw new Error('Failed to fetch schedule')
  return res.json()
}

export async function createSchedule(data: Partial<Schedule>) {
  const res = await fetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    cache: "no-store"
  })
  if (!res.ok) throw new Error('Failed to create schedule')
  return res.json()
}

export async function updateSchedule(id: string, data: Partial<Schedule>) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    cache: "no-store"
  })
  if (!res.ok) throw new Error('Failed to update schedule')
  return res.json()
}

export async function deleteSchedule(id: string) {
  const res = await fetch(`${baseUrl}/${id}`, { 
    method: 'DELETE',
    cache: "no-store"
  })
  if (!res.ok) throw new Error('Failed to delete schedule')
  return res.json()
}