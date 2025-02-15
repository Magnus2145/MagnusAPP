import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const fakture = await prisma.faktura.findMany({
      orderBy: { datum: "desc" },
    })
    return NextResponse.json(fakture)
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Došlo je do problema prilikom dohvaćanja faktura" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { klijent, ukupanIznos, status } = await req.json()

    const zadnjiFakturaBroj = await prisma.faktura.findFirst({
      orderBy: { broj: "desc" },
      select: { broj: true },
    })

    const noviBroj = zadnjiFakturaBroj ? Number.parseInt(zadnjiFakturaBroj.broj) + 1 : 1

    const faktura = await prisma.faktura.create({
      data: {
        broj: noviBroj.toString().padStart(5, "0"),
        klijent,
        ukupanIznos,
        status,
        datum: new Date(),
      },
    })

    return NextResponse.json(faktura)
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json({ error: "Došlo je do problema prilikom kreiranja fakture" }, { status: 500 })
  }
}

