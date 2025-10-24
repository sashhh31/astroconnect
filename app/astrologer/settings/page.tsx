"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bell, Clock, DollarSign, Shield, HelpCircle, LogOut, Home, Users, Wallet, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { StarsBackground } from "@/components/stars-background"
import { Switch } from "@/components/ui/switch"

export default function AstrologerSettingsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoAccept, setAutoAccept] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("astrologer_logged_in")
    router.push("/astrologer/login")
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <StarsBackground />

      <div className="relative z-10 p-6 pb-24">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full bg-white shadow-md">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-600">Manage your preferences</p>
          </div>
        </div>

        {/* Notifications */}
        <GlassmorphicCard className="mb-4 p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-2">
              <Bell className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Push Notifications</span>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Sound Alerts</span>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>
          </div>
        </GlassmorphicCard>

        {/* Consultation Settings */}
        <GlassmorphicCard className="mb-4 p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900">Consultation</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Auto-accept requests</span>
              <Switch checked={autoAccept} onCheckedChange={setAutoAccept} />
            </div>
            <button className="flex w-full items-center justify-between rounded-lg bg-white/50 p-3 transition-colors hover:bg-white/70">
              <span className="text-sm text-gray-700">Manage Availability</span>
              <span className="text-xs text-gray-500">→</span>
            </button>
          </div>
        </GlassmorphicCard>

        {/* Payment Settings */}
        <GlassmorphicCard className="mb-4 p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900">Payment</h3>
          </div>
          <div className="space-y-3">
            <button className="flex w-full items-center justify-between rounded-lg bg-white/50 p-3 transition-colors hover:bg-white/70">
              <span className="text-sm text-gray-700">Update Pricing</span>
              <span className="text-xs text-gray-500">→</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-lg bg-white/50 p-3 transition-colors hover:bg-white/70">
              <span className="text-sm text-gray-700">Bank Details</span>
              <span className="text-xs text-gray-500">→</span>
            </button>
          </div>
        </GlassmorphicCard>

        {/* Account Settings */}
        <GlassmorphicCard className="mb-4 p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-2">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900">Account</h3>
          </div>
          <div className="space-y-3">
            <button className="flex w-full items-center justify-between rounded-lg bg-white/50 p-3 transition-colors hover:bg-white/70">
              <span className="text-sm text-gray-700">Change Password</span>
              <span className="text-xs text-gray-500">→</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-lg bg-white/50 p-3 transition-colors hover:bg-white/70">
              <span className="text-sm text-gray-700">Privacy Settings</span>
              <span className="text-xs text-gray-500">→</span>
            </button>
          </div>
        </GlassmorphicCard>

        {/* Help & Support */}
        <GlassmorphicCard className="mb-4 p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-yellow-100 p-2">
              <HelpCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <h3 className="font-bold text-gray-900">Help & Support</h3>
          </div>
          <div className="space-y-3">
            <button className="flex w-full items-center justify-between rounded-lg bg-white/50 p-3 transition-colors hover:bg-white/70">
              <span className="text-sm text-gray-700">FAQs</span>
              <span className="text-xs text-gray-500">→</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-lg bg-white/50 p-3 transition-colors hover:bg-white/70">
              <span className="text-sm text-gray-700">Contact Support</span>
              <span className="text-xs text-gray-500">→</span>
            </button>
          </div>
        </GlassmorphicCard>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          className="h-12 w-full rounded-xl bg-red-500 font-bold text-white hover:bg-red-600"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="flex items-center justify-around p-4">
          <button 
            onClick={() => router.push("/astrologer/dashboard")}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors"
          >
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button 
            onClick={() => router.push("/astrologer/clients")}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors"
          >
            <Users className="h-6 w-6" />
            <span className="text-xs font-medium">Clients</span>
          </button>
          <button 
            onClick={() => router.push("/astrologer/wallet")}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors"
          >
            <Wallet className="h-6 w-6" />
            <span className="text-xs font-medium">Wallet</span>
          </button>
          <button 
            onClick={() => router.push("/astrologer/settings")}
            className="flex flex-col items-center gap-1 text-orange-600"
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}
