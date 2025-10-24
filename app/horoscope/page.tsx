"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Calendar, TrendingUp } from "lucide-react"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { BottomNav } from "@/components/bottom-nav"

const zodiacSigns = [
  { id: "aries", name: "Aries", symbol: "♈", dates: "Mar 21 - Apr 19", color: "text-red-500" },
  { id: "taurus", name: "Taurus", symbol: "♉", dates: "Apr 20 - May 20", color: "text-green-600" },
  { id: "gemini", name: "Gemini", symbol: "♊", dates: "May 21 - Jun 20", color: "text-yellow-600" },
  { id: "cancer", name: "Cancer", symbol: "♋", dates: "Jun 21 - Jul 22", color: "text-blue-500" },
  { id: "leo", name: "Leo", symbol: "♌", dates: "Jul 23 - Aug 22", color: "text-orange-500" },
  { id: "virgo", name: "Virgo", symbol: "♍", dates: "Aug 23 - Sep 22", color: "text-green-500" },
  { id: "libra", name: "Libra", symbol: "♎", dates: "Sep 23 - Oct 22", color: "text-pink-500" },
  { id: "scorpio", name: "Scorpio", symbol: "♏", dates: "Oct 23 - Nov 21", color: "text-red-600" },
  { id: "sagittarius", name: "Sagittarius", symbol: "♐", dates: "Nov 22 - Dec 21", color: "text-purple-500" },
  { id: "capricorn", name: "Capricorn", symbol: "♑", dates: "Dec 22 - Jan 19", color: "text-gray-600" },
  { id: "aquarius", name: "Aquarius", symbol: "♒", dates: "Jan 20 - Feb 18", color: "text-cyan-500" },
  { id: "pisces", name: "Pisces", symbol: "♓", dates: "Feb 19 - Mar 20", color: "text-indigo-500" },
]

export default function HoroscopePage() {
  const router = useRouter()
  const [selectedSign] = useState("aries")

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-24">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-2xl font-bold text-foreground">Daily Horoscope</h1>
          <p className="text-sm text-muted-foreground">Discover what the stars have in store for you</p>
        </div>

        {/* Zodiac Signs Grid */}
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Select Your Zodiac Sign</h2>
          <div className="grid grid-cols-4 gap-3">
            {zodiacSigns.map((sign) => (
              <button
                key={sign.id}
                onClick={() => router.push(`/horoscope/${sign.id}`)}
                className="flex flex-col items-center gap-2 rounded-xl bg-card/80 p-3 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg"
              >
                <span className={`text-3xl ${sign.color}`}>{sign.symbol}</span>
                <span className="text-xs font-medium text-foreground">{sign.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Content */}
        <div className="space-y-4">
          <GlassmorphicCard
            className="cursor-pointer overflow-hidden p-0 transition-all hover:shadow-xl"
            onClick={() => router.push("/horoscope/weekly")}
          >
            <div className="relative bg-gradient-to-r from-primary/20 to-secondary/20 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Weekly Horoscope</h3>
                  <p className="text-sm text-muted-foreground">Plan your week ahead</p>
                </div>
                <Sparkles className="h-8 w-8 text-primary/40" />
              </div>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard
            className="cursor-pointer overflow-hidden p-0 transition-all hover:shadow-xl"
            onClick={() => router.push("/horoscope/monthly")}
          >
            <div className="relative bg-gradient-to-r from-accent/20 to-primary/20 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Monthly Horoscope</h3>
                  <p className="text-sm text-muted-foreground">Your month at a glance</p>
                </div>
                <Sparkles className="h-8 w-8 text-accent/40" />
              </div>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard
            className="cursor-pointer overflow-hidden p-0 transition-all hover:shadow-xl"
            onClick={() => router.push("/blog")}
          >
            <div className="relative bg-gradient-to-r from-secondary/20 to-primary/20 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20">
                  <Sparkles className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Astrology Blog</h3>
                  <p className="text-sm text-muted-foreground">Read latest articles</p>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
