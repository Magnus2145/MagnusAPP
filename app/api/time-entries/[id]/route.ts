import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "SERVISER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params

  try {
    const timeEntry = await prisma.timeEntry.findUnique({
      where: { id },
    })

    if (!timeEntry) {
      return NextResponse.json({ error: "Time entry not found" }, { status: 404 })
    }

    if (timeEntry.serviserId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const endTime = new Date()
    const duration = Math.round((endTime.getTime() - timeEntry.start.getTime()) / 1000)

    const updatedTimeEntry = await prisma.timeEntry.update({
      where: { id },
      data: {
        end: endTime,
        duration,
      },
    })

    return NextResponse.json(updatedTimeEntry)
  } catch (error) {
    console.error("Error updating time entry:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

