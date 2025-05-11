import { Role } from "./role"

export interface User {
   id: string
   name: string
   email: string
   password: string
   role: Role | string
}