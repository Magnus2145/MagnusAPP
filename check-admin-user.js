import prisma from "./lib/prisma"

async function checkAdminUser() {
  try {
    const adminUser = await prisma.user.findUnique({
      where: {
        email: "admin@magnus.com",
      },
    })

    if (adminUser) {
      console.log("Admin user found:", adminUser)
    } else {
      console.log("Admin user not found in the database")
    }
  } catch (error) {
    console.error("Error checking admin user:", error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdminUser()

