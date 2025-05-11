import { prisma } from "@/libs/client"
import { hash } from "bcryptjs"

async function main() {
  await prisma.user.createMany({
    data: [
      {
        name: "Admin",
        email: "admin@gmail.com",
        password: await hash("password", 10),
        role: "ADMIN",
      },
      {
        name: "Manager",
        email: "manager@gmail.com",
        password: await hash("password", 10),
        role: "MANAGER",
      },
      {
        name: "Member",
        email: "member@gmail.com",
        password: await hash("password", 10),
        role: "MEMBER",
      },
    ],
    skipDuplicates: true,
  })
}

main()
  .then(() => {
    console.log("Seeding selesai.")
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })