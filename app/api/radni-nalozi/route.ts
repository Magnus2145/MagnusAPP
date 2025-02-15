import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { klijent, opis, adresa, kontaktOsoba, telefon, email, prioritet } = await req.json()

    const radniNalog = await prisma.radniNalog.create({
      data: {
        klijent,
        opis,
        adresa,
        kontaktOsoba,
        telefon,
        email,
        prioritet,
        status: "NOVI",
      },
    })

    return NextResponse.json(radniNalog)
  } catch (error) {
    console.error("Error creating work order:", error)
    return NextResponse.json({ error: "Došlo je do problema prilikom kreiranja radnog naloga" }, { status: 500 })
  }
}

