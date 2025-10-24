"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { consultationsAPI } from "@/lib/client/api"
import { ArrowLeft, MessageCircle, Phone, Video, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassmorphicCard } from "@/components/glassmorphic-card"

// Moved to state - will be fetched from API

export default function ConsultationHistoryPage() {
  const router = useRouter()
  const [consultations, setConsultations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await consultationsAPI.list(1)
        setConsultations(data.consultations || [])
      } catch (error) {
        console.error('Failed to fetch history:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "chat":
        return <MessageCircle className="h-4 w-4" />
      case "call":
        return <Phone className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-background to-background/80 backdrop-blur-lg">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Consultation History</h1>
            <p className="text-sm text-muted-foreground">{consultations.length} consultations</p>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3 px-4 py-4">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : consultations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No consultations yet</div>
        ) : consultations.map((consultation) => (
          <GlassmorphicCard key={consultation.id} className="p-4">
            <div className="mb-3 flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={consultation.image || "/placeholder.svg"} />
                <AvatarFallback>{consultation.astrologer[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{consultation.astrologerName}</h3>
                <p className="text-xs text-muted-foreground">{new Date(consultation.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge variant="secondary" className="gap-1">
                {getTypeIcon(consultation.type)}
                {consultation.type}
              </Badge>
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium text-foreground">{consultation.durationMinutes || 0} min</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-medium text-foreground">₹{parseFloat(consultation.totalAmount || '0').toFixed(0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {consultation.userRating ? (
                  [...Array(consultation.userRating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">Not rated</span>
                )}
              </div>
            </div>
          </GlassmorphicCard>
        ))}
      </div>
    </div>
  )
}
