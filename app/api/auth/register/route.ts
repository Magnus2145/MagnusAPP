import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    const hashedPassword = await bcrypt.hash(password, 10)

    const userCount = await prisma.user.count()
    const role = userCount === 0 ? "ADMIN" : "USER"

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

