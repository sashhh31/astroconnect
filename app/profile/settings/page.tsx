"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bell, Moon, Globe, Lock, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [currentMode, setCurrentMode] = useState<"offline" | "ai">("offline")

  useEffect(() => {
    const mode = localStorage.getItem("astro_mode") as "offline" | "ai"
    if (mode) setCurrentMode(mode)
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-background to-background/80 backdrop-blur-lg">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
        </div>
      </div>

      <div className="space-y-6 px-4 py-6">
        {/* App Mode */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">App Mode</h2>
          <GlassmorphicCard
            className="cursor-pointer p-4 transition-all hover:shadow-xl"
            onClick={() => router.push("/mode-selection")}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                {currentMode === "offline" ? (
                  <Globe className="h-5 w-5 text-primary" />
                ) : (
                  <Bot className="h-5 w-5 text-accent" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Current Mode</p>
                <p className="text-xs text-muted-foreground">
                  {currentMode === "offline" ? "Offline App Mode" : "AI Agent Mode"}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Switch
              </Button>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Notifications */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Notifications</h2>
          <GlassmorphicCard className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label htmlFor="notifications" className="font-medium">
                    Push Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">Receive updates and alerts</p>
                </div>
              </div>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </GlassmorphicCard>
        </div>

        {/* Appearance */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Appearance</h2>
          <GlassmorphicCard className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Moon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label htmlFor="dark-mode" className="font-medium">
                    Dark Mode
                  </Label>
                  <p className="text-xs text-muted-foreground">Switch to dark theme</p>
                </div>
              </div>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </GlassmorphicCard>
        </div>

        {/* Language */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Language & Region</h2>
          <GlassmorphicCard className="cursor-pointer p-4 transition-all hover:shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Language</p>
                <p className="text-xs text-muted-foreground">English (US)</p>
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Privacy */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Privacy & Security</h2>
          <GlassmorphicCard className="cursor-pointer p-4 transition-all hover:shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Change Password</p>
                <p className="text-xs text-muted-foreground">Update your password</p>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </div>
    </div>
  )
}
