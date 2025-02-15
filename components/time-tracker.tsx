"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"

interface TimeEntry {
  id: string
  start: string
  end: string | null
  duration: number | null
  radniNalogId: string
  radniNalogBroj: number
}

export function TimeTracker({ radniNalogId, radniNalogBroj }: { radniNalogId: string; radniNalogBroj: number }) {
  const [isTracking, setIsTracking] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null)
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const { data: session } = useSession()

  useEffect(() => {
    fetchTimeEntries()
  }, []) // Removed radniNalogId from dependencies

  const fetchTimeEntries = async () => {
    try {
      const response = await fetch(`/api/time-entries?radniNalogId=${radniNalogId}`)
      if (response.ok) {
        const data = await response.json()
        setTimeEntries(data)
        const activeEntry = data.find((entry: TimeEntry) => !entry.end)
        if (activeEntry) {
          setCurrentEntry(activeEntry)
          setIsTracking(true)
        }
      }
    } catch (error) {
      console.error("Error fetching time entries:", error)
      toast({
        title: "Greška",
        description: "Nije moguće dohvatiti zapise o vremenu.",
        variant: "destructive",
      })
    }
  }

  const startTracking = async () => {
    try {
      const response = await fetch("/api/time-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ radniNalogId, radniNalogBroj }),
      })
      if (response.ok) {
        const data = await response.json()
        setCurrentEntry(data)
        setIsTracking(true)
        toast({
          title: "Uspjeh",
          description: "Praćenje vremena je započeto.",
        })
      }
    } catch (error) {
      console.error("Error starting time tracking:", error)
      toast({
        title: "Greška",
        description: "Nije moguće započeti praćenje vremena.",
        variant: "destructive",
      })
    }
  }

  const stopTracking = async () => {
    if (!currentEntry) return

    try {
      const response = await fetch(`/api/time-entries/${currentEntry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      })
      if (response.ok) {
        setIsTracking(false)
        setCurrentEntry(null)
        fetchTimeEntries()
        toast({
          title: "Uspjeh",
          description: "Praćenje vremena je zaustavljeno.",
        })
      }
    } catch (error) {
      console.error("Error stopping time tracking:", error)
      toast({
        title: "Greška",
        description: "Nije moguće zaustaviti praćenje vremena.",
        variant: "destructive",
      })
    }
  }

  const formatDuration = (durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600)
    const minutes = Math.floor((durationInSeconds % 3600) / 60)
    const seconds = durationInSeconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  if (session?.user.role !== "SERVISER") {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Praćenje vremena - Radni nalog #{radniNalogBroj}</CardTitle>
      </CardHeader>
      <CardContent>
        {isTracking ? (
          <Button onClick={stopTracking} variant="destructive">
            Zaustavi praćenje
          </Button>
        ) : (
          <Button onClick={startTracking}>Započni praćenje</Button>
        )}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Zapisi o vremenu:</h3>
          <ul className="space-y-2">
            {timeEntries.map((entry) => (
              <li key={entry.id}>
                {new Date(entry.start).toLocaleString()} -
                {entry.end ? new Date(entry.end).toLocaleString() : "U tijeku"}(
                {entry.duration ? formatDuration(entry.duration) : "N/A"})
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

