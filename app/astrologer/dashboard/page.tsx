"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Home,
  Users,
  MessageSquare,
  Phone,
  Video,
  Wallet,
  Settings,
  LogOut,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { StarsBackground } from "@/components/stars-background"
import { astrologerAPI } from "@/lib/client/api"

interface DashboardData {
  todayEarnings: number
  consultationsCount: number
  rating: number
  onlineTime: string
  recentConsultations: any[]
  astrologerName?: string
}

export default function AstrologerDashboard() {
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        const data = await astrologerAPI.getDashboard() as any
        setDashboardData({
          todayEarnings: data.todayEarnings || data.earnings?.today || 0,
          consultationsCount: data.consultationsCount || data.consultations?.today || 0,
          rating: data.rating || data.averageRating || 0,
          onlineTime: data.onlineTime || data.onlineHours || "0h",
          recentConsultations: data.recentConsultations || data.recent || [],
          astrologerName: data.astrologerName || data.name
        })
        setIsOnline(data.isOnline || false)
      } catch (error) {
        console.error("Failed to fetch dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const handleLogout = async () => {
    try {
      await astrologerAPI.logout()
      localStorage.removeItem("astrologer_logged_in")
      localStorage.removeItem("accessToken")
      router.push("/astrologer/login")
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/astrologer/login")
    }
  }

  const handleToggleOnline = async () => {
    try {
      if (isOnline) {
        await astrologerAPI.setOffline()
      } else {
        await astrologerAPI.setOnline()
      }
      setIsOnline(!isOnline)
    } catch (error) {
      console.error("Failed to toggle status:", error)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <StarsBackground />

      <div className="relative z-10 p-6 pb-24">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {dashboardData?.astrologerName || "Astrologer"}!</p>
          </div>
          <Button onClick={handleLogout} variant="ghost" size="icon" className="rounded-full bg-white shadow-md">
            <LogOut className="h-5 w-5 text-gray-700" />
          </Button>
        </div>

        {/* Online Status Toggle */}
        <GlassmorphicCard className="mb-6 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Availability Status</h3>
              <p className="text-sm text-gray-600">{isOnline ? "You are online" : "You are offline"}</p>
            </div>
            <Button
              onClick={handleToggleOnline}
              className={`h-12 w-24 rounded-full font-bold ${
                isOnline ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"
              }`}
              disabled={loading}
            >
              {isOnline ? "Online" : "Offline"}
            </Button>
          </div>
        </GlassmorphicCard>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <GlassmorphicCard className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-full bg-orange-100 p-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">₹{dashboardData?.todayEarnings?.toLocaleString() || 0}</p>
            <p className="text-sm text-gray-600">Today's Earnings</p>
          </GlassmorphicCard>

          <GlassmorphicCard className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-full bg-blue-100 p-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{dashboardData?.consultationsCount || 0}</p>
            <p className="text-sm text-gray-600">Consultations</p>
          </GlassmorphicCard>

          <GlassmorphicCard className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-full bg-yellow-100 p-2">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{dashboardData?.rating?.toFixed(1) || "0.0"}</p>
            <p className="text-sm text-gray-600">Rating</p>
          </GlassmorphicCard>

          <GlassmorphicCard className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-full bg-green-100 p-2">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{dashboardData?.onlineTime || "0h"}</p>
            <p className="text-sm text-gray-600">Online Time</p>
          </GlassmorphicCard>
        </div>

        {/* Quick Actions */}
        <GlassmorphicCard className="mb-6 p-4">
          <h3 className="mb-4 font-bold text-gray-900">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => router.push("/astrologer/consultations")}
              className="flex flex-col items-center gap-2 rounded-xl bg-orange-50 p-3 transition-all hover:bg-orange-100"
            >
              <MessageSquare className="h-6 w-6 text-orange-600" />
              <span className="text-xs font-medium text-gray-700">Chat</span>
            </button>
            <button 
              onClick={() => router.push("/astrologer/consultations")}
              className="flex flex-col items-center gap-2 rounded-xl bg-blue-50 p-3 transition-all hover:bg-blue-100"
            >
              <Phone className="h-6 w-6 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">Call</span>
            </button>
            <button 
              onClick={() => router.push("/astrologer/consultations")}
              className="flex flex-col items-center gap-2 rounded-xl bg-purple-50 p-3 transition-all hover:bg-purple-100"
            >
              <Video className="h-6 w-6 text-purple-600" />
              <span className="text-xs font-medium text-gray-700">Video</span>
            </button>
          </div>
        </GlassmorphicCard>

        {/* Recent Consultations */}
        <GlassmorphicCard className="p-4">
          <h3 className="mb-4 font-bold text-gray-900">Recent Consultations</h3>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            </div>
          ) : (
          <div className="space-y-3">
            {dashboardData?.recentConsultations && dashboardData.recentConsultations.length > 0 ? (
              dashboardData.recentConsultations.slice(0, 3).map((consultation: any) => (
                <div key={consultation.id} className="flex items-center justify-between rounded-lg bg-white/50 p-3">
                  <div>
                    <p className="font-medium text-gray-900">{consultation.userName || consultation.user?.name || "User"}</p>
                    <p className="text-xs text-gray-600">
                      {consultation.type || "Chat"} • {consultation.duration || "15 mins"} • ₹{consultation.amount || 150}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{consultation.timeAgo || "Recently"}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 py-4">No recent consultations</p>
            )}
          </div>
          )}
        </GlassmorphicCard>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="flex items-center justify-around p-4">
          <button 
            onClick={() => router.push("/astrologer/dashboard")}
            className="flex flex-col items-center gap-1 text-orange-600"
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
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors"
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}
