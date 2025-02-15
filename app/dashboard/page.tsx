"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const { data: session } = useSession()

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Dobrodošli, {session?.user?.name}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Vaša uloga: {session?.user?.role}</p>
        </CardContent>
      </Card>
    </div>
  )
}

