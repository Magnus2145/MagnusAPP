"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface Faktura {
  id: number
  broj: string
  klijent: string
  datum: string
  ukupanIznos: number
  status: string
}

export default function Fakture() {
  const [fakture, setFakture] = useState<Faktura[]>([])
  const [klijent, setKlijent] = useState("")
  const [iznos, setIznos] = useState("")
  const [status, setStatus] = useState("NEPLACENO")

  useEffect(() => {
    fetchFakture()
  }, [])

  const fetchFakture = async () => {
    try {
      const response = await fetch("/api/fakture")
      if (response.ok) {
        const data = await response.json()
        setFakture(data)
      }
    } catch (error) {
      console.error("Error fetching invoices:", error)
      toast({
        title: "Greška",
        description: "Došlo je do problema prilikom dohvaćanja faktura",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/fakture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ klijent, ukupanIznos: Number(iznos), status }),
      })

      if (response.ok) {
        toast({
          title: "Uspjeh",
          description: "Faktura je uspješno kreirana.",
        })
        setKlijent("")
        setIznos("")
        setStatus("NEPLACENO")
        fetchFakture()
      } else {
        throw new Error("Došlo je do problema prilikom kreiranja fakture")
      }
    } catch (error) {
      console.error("Error creating invoice:", error)
      toast({
        title: "Greška",
        description: "Došlo je do problema prilikom kreiranja fakture",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Upravljanje fakturama</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="klijent">Klijent</Label>
              <Input id="klijent" value={klijent} onChange={(e) => setKlijent(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iznos">Ukupan iznos</Label>
              <Input
                id="iznos"
                type="number"
                step="0.01"
                value={iznos}
                onChange={(e) => setIznos(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={setStatus} defaultValue={status}>
                <SelectTrigger>
                  <SelectValue placeholder="Odaberi status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEPLACENO">Neplaćeno</SelectItem>
                  <SelectItem value="PLACENO">Plaćeno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Kreiraj fakturu</Button>
          </form>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Popis faktura</h3>
            {fakture.map((faktura) => (
              <Card key={faktura.id}>
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <p className="font-medium">Faktura #{faktura.broj}</p>
                    <p className="text-sm text-gray-500">Klijent: {faktura.klijent}</p>
                    <p className="text-sm text-gray-500">Datum: {faktura.datum}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{faktura.ukupanIznos.toFixed(2)} kn</p>
                    <p className={`text-sm ${faktura.status === "PLACENO" ? "text-green-500" : "text-red-500"}`}>
                      {faktura.status === "PLACENO" ? "Plaćeno" : "Neplaćeno"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

