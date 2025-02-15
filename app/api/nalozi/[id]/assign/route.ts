import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { serviserId } = await req.json()
    const { id } = params

    const updatedNalog = await prisma.radniNalog.update({
      where: { id },
      data: { serviserId },
    })

    return NextResponse.json(updatedNalog)
  } catch (error) {
    console.error("Error assigning radni nalog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

