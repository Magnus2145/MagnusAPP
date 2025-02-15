"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface Serviser {
  id: string
  name: string
  specialization: string
}

interface AssignServiserProps {
  radniNalogId: string
  currentServiserId?: string
  onAssign: (serviserId: string) => void
}

export function AssignServiser({ radniNalogId, currentServiserId, onAssign }: AssignServiserProps) {
  const [serviseri, setServiseri] = useState<Serviser[]>([])
  const [selectedServiserId, setSelectedServiserId] = useState<string | undefined>(currentServiserId)

  useEffect(() => {
    const fetchServiseri = async () => {
      try {
        const response = await fetch("/api/serviseri")
        if (response.ok) {
          const data = await response.json()
          setServiseri(data)
        } else {
          throw new Error("Failed to fetch serviseri")
        }
      } catch (error) {
        console.error("Error fetching serviseri:", error)
        toast({
          title: "Greška",
          description: "Nije moguće dohvatiti popis servisera.",
          variant: "destructive",
        })
      }
    }

    fetchServiseri()
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
      const response = await fetch(`/api/nalozi/${radniNalogId}/assign`, {
        method: "PUT",
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
        throw new Error("Failed to assign radni nalog")
      }
    } catch (error) {
      console.error("Error assigning radni nalog:", error)
      toast({
        title: "Greška",
        description: "Nije moguće dodijeliti radni nalog serviseru.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <Select onValueChange={setSelectedServiserId} value={selectedServiserId}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Odaberi servisera" />
        </SelectTrigger>
        <SelectContent>
          {serviseri.map((serviser) => (
            <SelectItem key={serviser.id} value={serviser.id}>
              {serviser.name} - {serviser.specialization}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleAssign} className="w-full">
        Dodijeli servisera
      </Button>
    </div>
  )
}

