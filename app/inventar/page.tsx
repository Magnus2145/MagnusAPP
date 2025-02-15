"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface InventarItem {
  id: number
  naziv: string
  kolicina: number
  cijena: number
}

export default function Inventar() {
  const [inventar, setInventar] = useState<InventarItem[]>([])
  const [naziv, setNaziv] = useState("")
  const [kolicina, setKolicina] = useState("")
  const [cijena, setCijena] = useState("")

  useEffect(() => {
    fetchInventar()
  }, [])

  const fetchInventar = async () => {
    try {
      const response = await fetch("/api/inventar")
      if (response.ok) {
        const data = await response.json()
        setInventar(data)
      }
    } catch (error) {
      console.error("Error fetching inventory:", error)
      toast({
        title: "Greška",
        description: "Došlo je do problema prilikom dohvaćanja inventara",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/inventar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ naziv, kolicina: Number(kolicina), cijena: Number(cijena) }),
      })

      if (response.ok) {
        toast({
          title: "Uspjeh",
          description: "Stavka inventara je uspješno dodana.",
        })
        setNaziv("")
        setKolicina("")
        setCijena("")
        fetchInventar()
      } else {
        throw new Error("Došlo je do problema prilikom dodavanja stavke inventara")
      }
    } catch (error) {
      console.error("Error adding inventory item:", error)
      toast({
        title: "Greška",
        description: "Došlo je do problema prilikom dodavanja stavke inventara",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Upravljanje inventarom</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="naziv">Naziv</Label>
              <Input id="naziv" value={naziv} onChange={(e) => setNaziv(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kolicina">Količina</Label>
              <Input
                id="kolicina"
                type="number"
                value={kolicina}
                onChange={(e) => setKolicina(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cijena">Cijena</Label>
              <Input
                id="cijena"
                type="number"
                step="0.01"
                value={cijena}
                onChange={(e) => setCijena(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Dodaj stavku</Button>
          </form>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Trenutni inventar</h3>
            {inventar.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <p className="font-medium">{item.naziv}</p>
                    <p className="text-sm text-gray-500">Količina: {item.kolicina}</p>
                  </div>
                  <p className="font-medium">{item.cijena.toFixed(2)} kn</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

