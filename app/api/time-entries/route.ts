import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "SERVISER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const radniNalogId = searchParams.get("radniNalogId")

  if (!radniNalogId) {
    return NextResponse.json({ error: "Missing radniNalogId" }, { status: 400 })
  }

  try {
    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        radniNalogId,
        serviserId: session.user.id,
      },
      orderBy: { start: "desc" },
    })

    return NextResponse.json(timeEntries)
  } catch (error) {
    console.error("Error fetching time entries:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "SERVISER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { radniNalogId, radniNalogBroj } = await req.json()

  try {
    const timeEntry = await prisma.timeEntry.create({
      data: {
        start: new Date(),
        radniNalogId,
        radniNalogBroj,
        serviserId: session.user.id,
      },
    })

    return NextResponse.json(timeEntry)
  } catch (error) {
    console.error("Error creating time entry:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

