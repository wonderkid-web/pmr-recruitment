export async function registerUser(form: {
   name: string
   email: string
   password: string
 }) {
   const res = await fetch("/api/auth/register", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(form),
   })
 
   if (!res.ok) {
     const error = await res.json()
     throw new Error(error?.message || "Failed to register")
   }
 
   return res.json()
}

export async function loginUser(form: {
   email: string
   password: string
 }) {
   const res = await fetch("/api/auth/login", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(form),
   })
 
   if (!res.ok) {
     const error = await res.json()
     throw new Error(error?.message || "Failed to login")
   }
 
   return res.json()
} 