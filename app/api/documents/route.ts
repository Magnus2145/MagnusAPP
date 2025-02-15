import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const radniNalogId = searchParams.get("radniNalogId")

  try {
    const documents = await prisma.document.findMany({
      where: radniNalogId ? { radniNalogId } : {},
      include: {
        uploader: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { naziv, opis, tip, url, velicina, radniNalogId } = await req.json()

    const document = await prisma.document.create({
      data: {
        naziv,
        opis,
        tip,
        url,
        velicina,
        uploaderId: session.user.id,
        radniNalogId,
      },
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error("Error creating document:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

