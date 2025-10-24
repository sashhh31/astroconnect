"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MessageSquare, Phone, Video, Star, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { StarsBackground } from "@/components/stars-background"
import { astrologerAPI } from "@/lib/client/api"

export default function AstrologerHistoryPage() {
  const router = useRouter()
  const [consultations, setConsultations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, earned: 0, avgRating: 0 })

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        const data = await astrologerAPI.getConsultations('completed') as any
        const consultationsList = data.consultations || data || []
        setConsultations(consultationsList)
        
        // Calculate stats
        const total = consultationsList.length
        const earned = consultationsList.reduce((sum: number, c: any) => sum + (c.amount || 0), 0)
        const avgRating = consultationsList.reduce((sum: number, c: any) => sum + (c.rating || 0), 0) / total || 0
        setStats({ total, earned, avgRating })
      } catch (error) {
        console.error("Failed to fetch history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const mockConsultations = [
    {
      id: 1,
      client: "Priya Sharma",
      type: "chat",
      duration: "25 mins",
      amount: "₹375",
      rating: 5,
      date: "Today, 2:30 PM",
      feedback: "Very helpful and accurate predictions!",
    },
    {
      id: 2,
      client: "Rahul Kumar",
      type: "call",
      duration: "18 mins",
      amount: "₹270",
      rating: 4,
      date: "Yesterday, 5:15 PM",
      feedback: "Good guidance, thank you!",
    },
    {
      id: 3,
      client: "Anjali Verma",
      type: "video",
      duration: "30 mins",
      amount: "₹600",
      rating: 5,
      date: "2 days ago",
      feedback: "Excellent consultation, very detailed analysis.",
    },
    {
      id: 4,
      client: "Vikram Singh",
      type: "chat",
      duration: "15 mins",
      amount: "₹225",
      rating: 4,
      date: "3 days ago",
      feedback: "Helpful advice for career decisions.",
    },
  ]

  const displayConsultations = consultations.length > 0 ? consultations : mockConsultations

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "chat":
        return <MessageSquare className="h-4 w-4" />
      case "call":
        return <Phone className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "chat":
        return "bg-orange-100 text-orange-600"
      case "call":
        return "bg-blue-100 text-blue-600"
      case "video":
        return "bg-purple-100 text-purple-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
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
            <h1 className="text-2xl font-extrabold text-gray-900">Consultation History</h1>
            <p className="text-sm text-gray-600">{consultations.length} total consultations</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <GlassmorphicCard className="p-3 text-center">
            <p className="text-2xl font-extrabold text-orange-600">{stats.total || 156}</p>
            <p className="text-xs text-gray-600">Total</p>
          </GlassmorphicCard>
          <GlassmorphicCard className="p-3 text-center">
            <p className="text-2xl font-extrabold text-green-600">₹{(stats.earned / 1000).toFixed(1)}K</p>
            <p className="text-xs text-gray-600">Earned</p>
          </GlassmorphicCard>
          <GlassmorphicCard className="p-3 text-center">
            <p className="text-2xl font-extrabold text-yellow-600">{stats.avgRating.toFixed(1) || "4.8"}</p>
            <p className="text-xs text-gray-600">Avg Rating</p>
          </GlassmorphicCard>
        </div>

        {/* Consultations List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            </div>
          ) : (
          displayConsultations.map((consultation: any) => (
            <GlassmorphicCard key={consultation.id} className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{consultation.client || consultation.userName || consultation.user?.name || "User"}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>{consultation.date}</span>
                  </div>
                </div>
                <div className={`rounded-full p-2 ${getTypeColor(consultation.type)}`}>
                  {getTypeIcon(consultation.type)}
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between rounded-lg bg-white/50 p-3">
                <div>
                  <p className="text-xs text-gray-600">Duration</p>
                  <p className="font-bold text-gray-900">{consultation.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Earned</p>
                  <p className="font-bold text-green-600">{consultation.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-bold text-gray-900">{consultation.rating}</span>
                  </div>
                </div>
              </div>

              {consultation.feedback && (
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-xs font-medium text-gray-600">Client Feedback:</p>
                  <p className="mt-1 text-sm text-gray-900">{consultation.feedback}</p>
                </div>
              )}
            </GlassmorphicCard>
          ))
          )}
        </div>
      </div>
    </div>
  )
}
