"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuth(requiredRole?: string) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Čekamo da se sesija učita

    if (!session) {
      router.push("/login")
    } else if (requiredRole && session.user.role !== requiredRole) {
      router.push("/unauthorized")
    }
  }, [session, status, requiredRole, router])

  return { session, status }
}

