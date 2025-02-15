"use client"

import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"

moment.locale("hr")
const localizer = momentLocalizer(moment)

interface Event {
  id: number
  title: string
  start: Date
  end: Date
  resourceId: number
}

interface Resource {
  id: number
  title: string
}

export function ServiserCalendar() {
  const [events, setEvents] = useState<Event[]>([])
  const [resources, setResources] = useState<Resource[]>([])

  useEffect(() => {
    fetchEvents()
    fetchServisers()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/scheduler/events")
      if (response.ok) {
        const data = await response.json()
        setEvents(
          data.map((event: any) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          })),
        )
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const fetchServisers = async () => {
    try {
      const response = await fetch("/api/servisers")
      if (response.ok) {
        const data = await response.json()
        setResources(
          data.map((serviser: any) => ({
            id: serviser.id,
            title: serviser.name,
          })),
        )
      }
    } catch (error) {
      console.error("Error fetching servisers:", error)
    }
  }

  return (
    <div style={{ height: "500px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        resources={resources}
        resourceIdAccessor="id"
        resourceTitleAccessor="title"
        defaultView="day"
        views={["day", "work_week"]}
        step={60}
        showMultiDayTimes
        messages={{
          next: "Sljedeće",
          previous: "Prethodno",
          today: "Danas",
          month: "Mjesec",
          week: "Tjedan",
          day: "Dan",
        }}
      />
    </div>
  )
}

