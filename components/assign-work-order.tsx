"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Serviser {
  id: number
  name: string
  currentWorkload: number
  specialization: string
}

interface AssignWorkOrderProps {
  workOrderId: number
  currentServiserId?: number
  onAssign: (serviserId: number) => void
}

export function AssignWorkOrder({ workOrderId, currentServiserId, onAssign }: AssignWorkOrderProps) {
  const [servisers, setServisers] = useState<Serviser[]>([])
  const [selectedServiserId, setSelectedServiserId] = useState<number | undefined>(currentServiserId)

  useEffect(() => {
    const fetchServisers = async () => {
      try {
        const response = await fetch("/api/servisers")
        if (response.ok) {
          const data = await response.json()
          setServisers(data)
        } else {
          throw new Error("Failed to fetch servisers")
        }
      } catch (error) {
        console.error("Error fetching servisers:", error)
        toast({
          title: "Greška",
          description: "Nije moguće dohvatiti popis servisera.",
          variant: "destructive",
        })
      }
    }

    fetchServisers()
  }, [])

  const handleAssign = async () => {
    if (!selectedServiserId) {
      toast({
        title: "Greška",
        description: "Molimo odaberite servisera.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/work-orders/${workOrderId}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serviserId: selectedServiserId }),
      })

      if (response.ok) {
        onAssign(selectedServiserId)
        toast({
          title: "Uspjeh",
          description: "Radni nalog je uspješno dodijeljen serviseru.",
        })
      } else {
        throw new Error("Failed to assign work order")
      }
    } catch (error) {
      console.error("Error assigning work order:", error)
      toast({
        title: "Greška",
        description: "Nije moguće dodijeliti radni nalog serviseru.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dodjela radnog naloga</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select
            onValueChange={(value) => setSelectedServiserId(Number(value))}
            value={selectedServiserId?.toString()}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Odaberi servisera" />
            </SelectTrigger>
            <SelectContent>
              {servisers.map((serviser) => (
                <SelectItem key={serviser.id} value={serviser.id.toString()}>
                  {serviser.name} - Opterećenje: {serviser.currentWorkload}, Specijalizacija: {serviser.specialization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAssign} className="w-full">
            Dodijeli
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

