import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const serviseri = await prisma.user.findMany({
      where: { role: "SERVISER" },
      select: {
        id: true,
        name: true,
        serviser: {
          select: {
            specialization: true,
          },
        },
      },
    })

    const formattedServiseri = serviseri.map((serviser) => ({
      id: serviser.id,
      name: serviser.name,
      specialization: serviser.serviser?.specialization || "Nije specificirano",
    }))

    return NextResponse.json(formattedServiseri)
  } catch (error) {
    console.error("Error fetching serviseri:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

