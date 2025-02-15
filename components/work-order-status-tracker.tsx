"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StatusUpdate {
  status: "Novi" | "U tijeku" | "Završen"
  description: string
  created_at: string
}

interface WorkOrderStatusTrackerProps {
  workOrderId: number
}

export function WorkOrderStatusTracker({ workOrderId }: WorkOrderStatusTrackerProps) {
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([])

  useEffect(() => {
    const fetchStatusUpdates = async () => {
      try {
        const response = await fetch(`/api/work-orders/${workOrderId}/status-updates`)
        if (response.ok) {
          const data = await response.json()
          setStatusUpdates(data)
        } else {
          throw new Error("Failed to fetch status updates")
        }
      } catch (error) {
        console.error("Error fetching status updates:", error)
      }
    }

    fetchStatusUpdates()
  }, [workOrderId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Novi":
        return "bg-blue-500"
      case "U tijeku":
        return "bg-yellow-500"
      case "Završen":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status radnog naloga</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusUpdates.map((update, index) => (
            <div key={index} className="flex items-start space-x-4">
              <Badge className={getStatusColor(update.status)}>{update.status}</Badge>
              <div>
                <p className="font-medium">{update.description}</p>
                <p className="text-sm text-gray-500">{new Date(update.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

