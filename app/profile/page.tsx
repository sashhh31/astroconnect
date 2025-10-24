"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { userAPI, authAPI } from "@/lib/client/api"
import {
  Settings,
  Heart,
  Clock,
  HelpCircle,
  FileText,
  Shield,
  LogOut,
  ChevronRight,
  Edit,
  Gift,
  Share2,
  Store,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { BottomNav } from "@/components/bottom-nav"

const menuItems = [
  { icon: Edit, label: "Edit Profile", href: "/profile/edit" },
  { icon: Clock, label: "Consultation History", href: "/profile/history" },
  { icon: Heart, label: "Favorite Astrologers", href: "/profile/favorites" },
  { icon: Gift, label: "Refer & Earn", href: "/profile/referral" },
  { icon: Store, label: "Check Our Store", href: "https://anytime-pooja.vercel.app/", external: true },
  { icon: Settings, label: "Settings", href: "/profile/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/profile/support" },
  { icon: FileText, label: "Terms & Conditions", href: "/profile/terms" },
  { icon: Shield, label: "Privacy Policy", href: "/profile/privacy" },
]

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userAPI.getProfile()
        setProfile(data)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem("astro_user")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      router.push("/login")
    }
  }

  const handleMenuClick = (href: string, label: string, external?: boolean) => {
    console.log("[v0] Navigating to:", href, "Label:", label, "External:", external)
    if (external) {
      window.open(href, "_blank", "noopener,noreferrer")
    } else {
      router.push(href)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-24">
      <div className="px-4 py-6">
        {/* Profile Header */}
        <GlassmorphicCard gradient className="mb-6 overflow-hidden p-0">
          <div className="relative bg-gradient-to-br from-primary via-secondary to-accent p-6">
            <div className="relative z-10 flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-white/20">
                <AvatarImage src={profile?.profileImageUrl || "/placeholder.svg"} />
                <AvatarFallback className="bg-white/20 text-2xl text-white">
                  {profile?.fullName?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="mb-1 text-xl font-bold text-white">{profile?.fullName || 'User'}</h1>
                <p className="mb-2 text-sm text-white/80">{profile?.phone || profile?.email}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-2 bg-white/20 text-white hover:bg-white/30"
                  onClick={() => handleMenuClick("/profile/edit", "Edit Profile")}
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <GlassmorphicCard className="p-4 text-center">
            <p className="mb-1 text-2xl font-bold text-primary">{profile?.totalConsultations || 0}</p>
            <p className="text-xs text-muted-foreground">Consultations</p>
          </GlassmorphicCard>
          <GlassmorphicCard className="p-4 text-center">
            <p className="mb-1 text-2xl font-bold text-primary">{profile?.favoritesCount || 0}</p>
            <p className="text-xs text-muted-foreground">Favorites</p>
          </GlassmorphicCard>
          <GlassmorphicCard className="p-4 text-center">
            <p className="mb-1 text-2xl font-bold text-primary">₹{profile?.walletBalance || 0}</p>
            <p className="text-xs text-muted-foreground">Wallet</p>
          </GlassmorphicCard>
        </div>

        {/* Referral Banner */}
        <GlassmorphicCard
          className="mb-6 cursor-pointer overflow-hidden p-0 transition-all hover:shadow-xl"
          onClick={() => handleMenuClick("/profile/referral", "Refer & Earn")}
        >
          <div className="relative bg-gradient-to-r from-secondary/20 to-primary/20 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Refer & Earn ₹100</h3>
                <p className="text-xs text-muted-foreground">Invite friends and get rewards</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </GlassmorphicCard>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <GlassmorphicCard
                key={item.href}
                className="cursor-pointer p-4 transition-all hover:shadow-xl"
                onClick={() => handleMenuClick(item.href, item.label, item.external)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="flex-1 font-medium text-foreground">{item.label}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </GlassmorphicCard>
            )
          })}
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="mt-6 w-full gap-2 border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
          size="lg"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>

        {/* App Version */}
        <p className="mt-6 text-center text-xs text-muted-foreground">Anytime Pooja v1.0.0</p>
      </div>

      <BottomNav />
    </div>
  )
}
