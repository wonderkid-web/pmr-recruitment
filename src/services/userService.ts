import { User } from '@prisma/client'

const baseUrl = '/api/user'

export async function getUsers(): Promise<User[]> {
  const res = await fetch(baseUrl, {
    cache: "no-store"
  })
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

export async function getUser(id: string): Promise<User> {
  const res = await fetch(`${baseUrl}/${id}`, {
    cache: "no-store"
  })
  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json()
}

export async function createUser(data: Partial<User>) {
  const res = await fetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    cache: "no-store"
  })
  if (!res.ok) throw new Error('Failed to create user')
  return res.json()
}

export async function updateUser(id: string, data: Partial<User>) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    cache: "no-store"
  })
  if (!res.ok) throw new Error('Failed to update user')
  return res.json()
}

export async function deleteUser(id: string) {
  const res = await fetch(`${baseUrl}/${id}`, { 
    method: 'DELETE',
    cache: "no-store"
  })
  if (!res.ok) throw new Error('Failed to delete user')
  return res.json()
}
