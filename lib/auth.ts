import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import { compare } from "bcryptjs"

const prisma = new PrismaClient()

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null

  const isValid = await compare(password, user.password)
  if (!isValid) return null

  return { id: user.id, email: user.email, name: user.name, role: user.role }
}

export function withAuth(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const token = authHeader.split(" ")[1]
    // U stvarnoj implementaciji, ovdje bismo provjerili JWT token
    // Za sada ćemo samo provjeriti je li token prisutan
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Ovdje bismo normalno dekodirali token i dohvatili korisničke podatke
    // Za sada ćemo samo proslijediti zahtjev dalje
    return handler(req, res)
  }
}

