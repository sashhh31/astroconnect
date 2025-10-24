"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Heart, Briefcase, DollarSign, HeartPulse, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { horoscopeAPI } from "@/lib/client/api"

interface HoroscopeData {
  overview: string
  love: string
  career: string
  finance: string
  health: string
  luckyNumber: number
  luckyColor: string
  compatibility: string
  rating?: number
}


export default function SignHoroscopePage() {
  const router = useRouter()
  const params = useParams()
  const sign = params.sign as string
  const signName = sign.charAt(0).toUpperCase() + sign.slice(1)
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHoroscope = async () => {
      try {
        setLoading(true)
        const data = await horoscopeAPI.daily(sign) as any
        setHoroscopeData({
          overview: data.overview || data.prediction || "No prediction available",
          love: data.love || "No love prediction available",
          career: data.career || "No career prediction available",
          finance: data.finance || data.money || "No finance prediction available",
          health: data.health || "No health prediction available",
          luckyNumber: data.luckyNumber || data.lucky_number || 7,
          luckyColor: data.luckyColor || data.lucky_color || "Blue",
          compatibility: data.compatibility || "All signs",
          rating: data.rating || 4.5
        })
      } catch (error) {
        console.error("Failed to fetch horoscope:", error)
        // Set default data on error
        setHoroscopeData({
          overview: "Unable to load horoscope. Please try again later.",
          love: "N/A",
          career: "N/A",
          finance: "N/A",
          health: "N/A",
          luckyNumber: 0,
          luckyColor: "N/A",
          compatibility: "N/A"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchHoroscope()
  }, [sign])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-background to-background/80 backdrop-blur-lg">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{signName} Horoscope</h1>
            <p className="text-sm text-muted-foreground">Today's Predictions</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-4 py-4">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
        {!loading && horoscopeData && (
        <>
        {/* Overview Card */}
        <GlassmorphicCard gradient className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Today's Overview</h2>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          <p className="leading-relaxed text-muted-foreground">{horoscopeData.overview}</p>
        </GlassmorphicCard>

        {/* Lucky Info */}
        <div className="grid grid-cols-3 gap-3">
          <GlassmorphicCard className="p-4 text-center">
            <p className="mb-1 text-xs text-muted-foreground">Lucky Number</p>
            <p className="text-2xl font-bold text-primary">{horoscopeData.luckyNumber}</p>
          </GlassmorphicCard>
          <GlassmorphicCard className="p-4 text-center">
            <p className="mb-1 text-xs text-muted-foreground">Lucky Color</p>
            <p className="text-sm font-bold text-foreground">{horoscopeData.luckyColor}</p>
          </GlassmorphicCard>
          <GlassmorphicCard className="p-4 text-center">
            <p className="mb-1 text-xs text-muted-foreground">Rating</p>
            <p className="text-2xl font-bold text-primary">{horoscopeData.rating || 4.5}</p>
          </GlassmorphicCard>
        </div>

        {/* Detailed Predictions */}
        <Tabs defaultValue="love" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="love">Love</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="finance">Money</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
          </TabsList>

          <TabsContent value="love" className="mt-4">
            <GlassmorphicCard className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-50">
                  <Heart className="h-6 w-6 text-pink-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Love & Relationships</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Progress value={85} className="h-2 flex-1" />
                    <span className="text-xs font-medium text-primary">85%</span>
                  </div>
                </div>
              </div>
              <p className="leading-relaxed text-muted-foreground">{horoscopeData.love}</p>
            </GlassmorphicCard>
          </TabsContent>

          <TabsContent value="career" className="mt-4">
            <GlassmorphicCard className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <Briefcase className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Career & Business</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Progress value={90} className="h-2 flex-1" />
                    <span className="text-xs font-medium text-primary">90%</span>
                  </div>
                </div>
              </div>
              <p className="leading-relaxed text-muted-foreground">{horoscopeData.career}</p>
            </GlassmorphicCard>
          </TabsContent>

          <TabsContent value="finance" className="mt-4">
            <GlassmorphicCard className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-50">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Finance & Wealth</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Progress value={75} className="h-2 flex-1" />
                    <span className="text-xs font-medium text-primary">75%</span>
                  </div>
                </div>
              </div>
              <p className="leading-relaxed text-muted-foreground">{horoscopeData.finance}</p>
            </GlassmorphicCard>
          </TabsContent>

          <TabsContent value="health" className="mt-4">
            <GlassmorphicCard className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                  <HeartPulse className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Health & Wellness</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Progress value={80} className="h-2 flex-1" />
                    <span className="text-xs font-medium text-primary">80%</span>
                  </div>
                </div>
              </div>
              <p className="leading-relaxed text-muted-foreground">{horoscopeData.health}</p>
            </GlassmorphicCard>
          </TabsContent>
        </Tabs>

        {/* Compatibility */}
        <GlassmorphicCard className="p-6">
          <h3 className="mb-3 font-semibold text-foreground">Best Compatibility</h3>
          <p className="text-sm text-muted-foreground">{horoscopeData.compatibility}</p>
        </GlassmorphicCard>
        </>
        )}
      </div>
    </div>
  )
}
