"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function NoviRadniNalog() {
  const [klijent, setKlijent] = useState("")
  const [opis, setOpis] = useState("")
  const [adresa, setAdresa] = useState("")
  const [kontaktOsoba, setKontaktOsoba] = useState("")
  const [telefon, setTelefon] = useState("")
  const [email, setEmail] = useState("")
  const [prioritet, setPrioritet] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/radni-nalozi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ klijent, opis, adresa, kontaktOsoba, telefon, email, prioritet }),
      })

      if (response.ok) {
        toast({
          title: "Uspjeh",
          description: "Radni nalog je uspješno kreiran.",
        })
        router.push("/radni-nalozi")
      } else {
        throw new Error("Došlo je do problema prilikom kreiranja radnog naloga")
      }
    } catch (error) {
      console.error("Error creating work order:", error)
      toast({
        title: "Greška",
        description: "Došlo je do problema prilikom kreiranja radnog naloga",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Novi radni nalog</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="klijent">Klijent</Label>
              <Input id="klijent" value={klijent} onChange={(e) => setKlijent(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="opis">Opis</Label>
              <Textarea id="opis" value={opis} onChange={(e) => setOpis(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adresa">Adresa</Label>
              <Input id="adresa" value={adresa} onChange={(e) => setAdresa(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kontaktOsoba">Kontakt osoba</Label>
              <Input
                id="kontaktOsoba"
                value={kontaktOsoba}
                onChange={(e) => setKontaktOsoba(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefon">Telefon</Label>
              <Input id="telefon" value={telefon} onChange={(e) => setTelefon(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prioritet">Prioritet</Label>
              <Select onValueChange={setPrioritet} required>
                <SelectTrigger>
                  <SelectValue placeholder="Odaberi prioritet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nizak">Nizak</SelectItem>
                  <SelectItem value="srednji">Srednji</SelectItem>
                  <SelectItem value="visok">Visok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Kreiranje..." : "Kreiraj radni nalog"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

