"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
}

export default function Profil() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setName(data.name)
        setEmail(data.email)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Greška",
        description: "Došlo je do problema prilikom dohvaćanja profila",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      })

      if (response.ok) {
        toast({
          title: "Uspjeh",
          description: "Profil je uspješno ažuriran.",
        })
        fetchProfile()
      } else {
        throw new Error("Došlo je do problema prilikom ažuriranja profila")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Greška",
        description: "Došlo je do problema prilikom ažuriranja profila",
        variant: "destructive",
      })
    }
  }

  if (!profile) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Korisnički profil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ime</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Uloga</Label>
              <Input value={profile.role} disabled />
            </div>
            <Button type="submit">Ažuriraj profil</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

