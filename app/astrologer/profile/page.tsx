"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Star, Users, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { StarsBackground } from "@/components/stars-background"
import Image from "next/image"
import { astrologerAPI } from "@/lib/client/api"

export default function AstrologerProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await astrologerAPI.getProfile()
        setProfile(data)
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <StarsBackground />

      <div className="relative z-10 p-6 pb-24">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full bg-white shadow-md">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Button>
          <Button
            onClick={() => router.push("/astrologer/profile/edit")}
            className="h-10 rounded-lg bg-orange-500 px-6 font-bold text-white hover:bg-orange-600"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        {/* Profile Header */}
        <GlassmorphicCard className="mb-6 p-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-200">
              <Image src="/indian-astrologer-male.jpg" alt="Profile" fill className="object-cover" />
            </div>
          </div>
          <h1 className="mb-1 text-2xl font-extrabold text-gray-900">{profile?.name || profile?.fullName || "Loading..."}</h1>
          <p className="mb-3 text-sm text-gray-600">{profile?.specialization || "Astrologer"} • {profile?.experience || "0"} years exp</p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <span className="font-bold text-gray-900">{profile?.rating?.toFixed(1) || "0.0"}</span>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-1">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="font-bold text-gray-900">{profile?.totalConsultations || profile?.consultations || 0}</span>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <GlassmorphicCard className="p-4 text-center">
            <div className="mb-2 flex justify-center">
              <div className="rounded-full bg-orange-100 p-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-gray-900">₹{profile?.totalEarnings?.toLocaleString() || 0}</p>
            <p className="text-xs text-gray-600">Total Earned</p>
          </GlassmorphicCard>

          <GlassmorphicCard className="p-4 text-center">
            <div className="mb-2 flex justify-center">
              <div className="rounded-full bg-blue-100 p-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-gray-900">{profile?.totalConsultations || 0}</p>
            <p className="text-xs text-gray-600">Consultations</p>
          </GlassmorphicCard>

          <GlassmorphicCard className="p-4 text-center">
            <div className="mb-2 flex justify-center">
              <div className="rounded-full bg-green-100 p-2">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-gray-900">{profile?.totalOnlineTime || "0h"}</p>
            <p className="text-xs text-gray-600">Online Time</p>
          </GlassmorphicCard>
        </div>

        {/* About */}
        <GlassmorphicCard className="mb-6 p-4">
          <h3 className="mb-3 font-bold text-gray-900">About</h3>
          <p className="text-sm leading-relaxed text-gray-700">
            {profile?.bio || profile?.about || "No bio available"}
          </p>
        </GlassmorphicCard>

        {/* Specializations */}
        <GlassmorphicCard className="mb-6 p-4">
          <h3 className="mb-3 font-bold text-gray-900">Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {(profile?.specializations || profile?.specialties || ["Vedic Astrology"]).map((spec: string) => (
              <span key={spec} className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                {spec}
              </span>
            ))}
          </div>
        </GlassmorphicCard>

        {/* Languages */}
        <GlassmorphicCard className="mb-6 p-4">
          <h3 className="mb-3 font-bold text-gray-900">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {(profile?.languages || ["Hindi", "English"]).map((lang: string) => (
              <span key={lang} className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                {lang}
              </span>
            ))}
          </div>
        </GlassmorphicCard>

        {/* Pricing */}
        <GlassmorphicCard className="p-4">
          <h3 className="mb-3 font-bold text-gray-900">Consultation Rates</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Chat</span>
              <span className="font-bold text-gray-900">₹{profile?.pricing?.chat || profile?.chatRate || 10}/min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Voice Call</span>
              <span className="font-bold text-gray-900">₹{profile?.pricing?.call || profile?.callRate || 15}/min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Video Call</span>
              <span className="font-bold text-gray-900">₹{profile?.pricing?.video || profile?.videoRate || 20}/min</span>
            </div>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  )
}
