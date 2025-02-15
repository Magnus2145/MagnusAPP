"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AssignServiser } from "@/components/assign-serviser"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { TimeTracker } from "@/components/time-tracker"
import { DocumentManager } from "@/components/document-manager"

interface RadniNalog {
  id: string
  broj: number
  opis: string
  status: string
  prioritet: string
  serviserId: string | null
  // Dodajte ostala polja prema potrebi
}

export default function DetaljiNaloga({ params }: { params: { id: string } }) {
  const [nalog, setNalog] = useState<RadniNalog | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchNalog = async () => {
      try {
        const response = await fetch(`/api/nalozi/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setNalog(data)
        } else {
          throw new Error("Failed to fetch radni nalog")
        }
      } catch (error) {
        console.error("Error fetching radni nalog:", error)
        toast({
          title: "Greška",
          description: "Nije moguće dohvatiti podatke o radnom nalogu.",
          variant: "destructive",
        })
      }
    }

    fetchNalog()
  }, [params.id])

  const handleAssign = (serviserId: string) => {
    setNalog((prevNalog) => (prevNalog ? { ...prevNalog, serviserId } : null))
  }

  if (!nalog) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Radni nalog #{nalog.broj}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Opis:</strong> {nalog.opis}
          </p>
          <p>
            <strong>Status:</strong> {nalog.status}
          </p>
          <p>
            <strong>Prioritet:</strong> {nalog.prioritet}
          </p>
          {/* Dodajte ostale detalje naloga ovdje */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dodijeli servisera</CardTitle>
        </CardHeader>
        <CardContent>
          <AssignServiser
            radniNalogId={nalog.id}
            currentServiserId={nalog.serviserId || undefined}
            onAssign={handleAssign}
          />
        </CardContent>
      </Card>

      <TimeTracker radniNalogId={nalog.id} radniNalogBroj={nalog.broj} />

      <DocumentManager radniNalogId={nalog.id} />

      <Button onClick={() => router.push("/nalozi")}>Natrag na popis naloga</Button>
    </div>
  )
}

