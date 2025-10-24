"use client"

import { useState } from "react"
import { Bell, X, Gift, Star, Wallet, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlassmorphicCard } from "@/components/glassmorphic-card"

interface Notification {
  id: number
  type: "offer" | "consultation" | "wallet" | "review"
  title: string
  message: string
  time: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "offer",
    title: "Special Offer!",
    message: "Get 20% extra on wallet recharge above ₹500",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "consultation",
    title: "Consultation Reminder",
    message: "Your session with Dr. Rajesh starts in 30 minutes",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "wallet",
    title: "Wallet Credited",
    message: "₹500 has been added to your wallet",
    time: "1 day ago",
    read: true,
  },
  {
    id: 4,
    type: "review",
    title: "Rate Your Experience",
    message: "How was your consultation with Priya Mehta?",
    time: "2 days ago",
    read: true,
  },
]

const notificationIcons = {
  offer: Gift,
  consultation: MessageCircle,
  wallet: Wallet,
  review: Star,
}

export function NotificationPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [notifications, setNotifications] = useState(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md animate-in slide-in-from-right bg-background shadow-2xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Notifications</h2>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 px-2 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="border-b border-border p-2">
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="w-full text-primary">
                Mark all as read
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4">
            {notifications.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Bell className="mb-4 h-16 w-16 text-muted-foreground/20" />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => {
                  const Icon = notificationIcons[notification.type]
                  return (
                    <GlassmorphicCard
                      key={notification.id}
                      className={`cursor-pointer p-4 transition-all hover:shadow-lg ${
                        !notification.read ? "border-l-4 border-primary" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                            notification.type === "offer"
                              ? "bg-yellow-500/10"
                              : notification.type === "consultation"
                                ? "bg-blue-500/10"
                                : notification.type === "wallet"
                                  ? "bg-green-500/10"
                                  : "bg-purple-500/10"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              notification.type === "offer"
                                ? "text-yellow-500"
                                : notification.type === "consultation"
                                  ? "text-blue-500"
                                  : notification.type === "wallet"
                                    ? "text-green-500"
                                    : "text-purple-500"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-foreground">{notification.title}</h3>
                            {!notification.read && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />}
                          </div>
                          <p className="mb-2 text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                    </GlassmorphicCard>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
