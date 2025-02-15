import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

export async function signToken(payload: any) {
  const token = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1d").sign(secret)
  return token
}

export async function getToken() {
  const cookieStore = cookies()
  return cookieStore.get("token")?.value
}

