"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"

interface Location {
  id: number
  address: string
  clientId: number
  client?: {
    name: string
  }
}

export function LocationList() {
  const [locations, setLocations] = useState<Location[]>([])
  const { data: session } = useSession()

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/locations")
        if (response.ok) {
          const data = await response.json()
          setLocations(data)
        } else {
          throw new Error("Failed to fetch locations")
        }
      } catch (error) {
        console.error("Error fetching locations:", error)
      }
    }

    fetchLocations()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {locations.map((location) => (
        <Card key={location.id}>
          <CardHeader>
            <CardTitle>{location.address}</CardTitle>
          </CardHeader>
          <CardContent>{session?.user.role === "admin" && <p>Klijent: {location.client?.name}</p>}</CardContent>
        </Card>
      ))}
    </div>
  )
}

