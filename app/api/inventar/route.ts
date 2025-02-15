import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const inventar = await prisma.inventarItem.findMany()
    return NextResponse.json(inventar)
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json({ error: "Došlo je do problema prilikom dohvaćanja inventara" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { naziv, kolicina, cijena } = await req.json()

    const inventarItem = await prisma.inventarItem.create({
      data: {
        naziv,
        kolicina,
        cijena,
      },
    })

    return NextResponse.json(inventarItem)
  } catch (error) {
    console.error("Error creating inventory item:", error)
    return NextResponse.json({ error: "Došlo je do problema prilikom dodavanja stavke inventara" }, { status: 500 })
  }
}

