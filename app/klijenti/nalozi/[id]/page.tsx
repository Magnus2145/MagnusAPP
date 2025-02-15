"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WorkOrderStatusTracker } from "@/components/work-order-status-tracker"

// Ovo bi trebalo doći iz API-ja ili baze podataka
const mockNalog = {
  id: 1,
  broj: 50,
  klijent: "Firma A",
  datum: "2023-05-10",
  opis: "Servis klima uređaja",
  adresa: "Ulica 1, 10000 Zagreb",
  kontaktOsoba: "Ivan Ivić",
  telefon: "091 234 5678",
  email: "ivan@firmaa.com",
  status: "U tijeku",
  prioritet: "Srednji",
  napomena: "Potrebno obaviti do kraja tjedna.",
}

export default function DetaljiNalogaKlijent({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [nalog, setNalog] = useState(mockNalog)

  useEffect(() => {
    // Ovdje bi se normalno dohvaćali podaci s API-ja
    const fetchNalog = async () => {
      const data = await fetch(`/api/klijenti/nalozi/${params.id}`).then((res) => res.json())
      setNalog(data)
    }
    fetchNalog()
  }, [params.id])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Natrag
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Radni nalog #{nalog.broj}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Klijent:</strong> {nalog.klijent}
              </p>
              <p>
                <strong>Datum:</strong> {nalog.datum}
              </p>
              <p>
                <strong>Status:</strong> {nalog.status}
              </p>
              <p>
                <strong>Prioritet:</strong> {nalog.prioritet}
              </p>
            </div>
            <div>
              <p>
                <strong>Adresa:</strong> {nalog.adresa}
              </p>
              <p>
                <strong>Kontakt osoba:</strong> {nalog.kontaktOsoba}
              </p>
              <p>
                <strong>Telefon:</strong> {nalog.telefon}
              </p>
              <p>
                <strong>Email:</strong> {nalog.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Opis posla</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{nalog.opis}</p>
        </CardContent>
      </Card>

      {nalog.napomena && (
        <Card>
          <CardHeader>
            <CardTitle>Napomena</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{nalog.napomena}</p>
          </CardContent>
        </Card>
      )}

      <WorkOrderStatusTracker workOrderId={nalog.id} />
    </div>
  )
}

