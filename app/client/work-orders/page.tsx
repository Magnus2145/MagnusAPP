"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"

interface WorkOrder {
  id: number
  number: number
  description: string
  status: string
  priority: string
  location: {
    address: string
  }
}

export default function ClientWorkOrders() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const { data: session } = useSession()

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await fetch("/api/client/work-orders")
        if (response.ok) {
          const data = await response.json()
          setWorkOrders(data)
        } else {
          throw new Error("Failed to fetch work orders")
        }
      } catch (error) {
        console.error("Error fetching work orders:", error)
      }
    }

    if (session?.user.role === "client") {
      fetchWorkOrders()
    }
  }, [session])

  if (session?.user.role !== "client") {
    return <div>Unauthorized</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vaši radni nalozi</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workOrders.map((workOrder) => (
          <Card key={workOrder.id}>
            <CardHeader>
              <CardTitle>Radni nalog #{workOrder.number}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Opis:</strong> {workOrder.description}
              </p>
              <p>
                <strong>Status:</strong> {workOrder.status}
              </p>
              <p>
                <strong>Prioritet:</strong> {workOrder.priority}
              </p>
              <p>
                <strong>Lokacija:</strong> {workOrder.location.address}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

