const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt")

const prisma = new PrismaClient()

async function main() {
  try {
    // Kreiranje admin korisnika
    const hashedPassword = await bcrypt.hash("admin123", 10)
    const admin = await prisma.user.upsert({
      where: { email: "admin@magnus.com" },
      update: {},
      create: {
        email: "admin@magnus.com",
        name: "Admin",
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    console.log("Admin korisnik kreiran:", admin.email)

    // Kreiranje test servisera
    const serviserPassword = await bcrypt.hash("serviser123", 10)
    const serviser = await prisma.user.upsert({
      where: { email: "serviser@magnus.com" },
      update: {},
      create: {
        email: "serviser@magnus.com",
        name: "Test Serviser",
        password: serviserPassword,
        role: "SERVISER",
      },
    })

    console.log("Serviser korisnik kreiran:", serviser.email)

    // Kreiranje test klijenta
    const clientPassword = await bcrypt.hash("client123", 10)
    const clientUser = await prisma.user.upsert({
      where: { email: "client@test.com" },
      update: {},
      create: {
        email: "client@test.com",
        name: "Test Klijent",
        password: clientPassword,
        role: "CLIENT",
      },
    })

    const client = await prisma.client.upsert({
      where: { userId: clientUser.id },
      update: {},
      create: {
        userId: clientUser.id,
        name: "Test Klijent d.o.o.",
        locations: {
          create: [
            {
              address: "Testna ulica 1, Zagreb",
            },
          ],
        },
      },
    })

    console.log("Klijent kreiran:", client.name)

    console.log("Baza podataka uspješno inicijalizirana!")
  } catch (error) {
    console.error("Greška prilikom inicijalizacije baze:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

