"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  message: string
  createdAt: string
  read: boolean
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" })
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="relative">
      <Button onClick={() => setIsOpen(!isOpen)} variant="ghost">
        <Bell />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </Button>
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 z-50">
          <CardHeader>
            <CardTitle>Obavijesti</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <p>Nema novih obavijesti</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-2 mb-2 rounded ${notification.read ? "bg-gray-100" : "bg-blue-100"}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <p>{notification.message}</p>
                    <small>{new Date(notification.createdAt).toLocaleString()}</small>
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

