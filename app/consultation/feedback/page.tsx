"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Star, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { consultationsAPI } from "@/lib/client/api"

interface Consultation {
  id: string
  astrologerId: string
  astrologerName: string
  astrologerAvatar?: string
  status: string
  type: string
}

function FeedbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const consultationId = searchParams.get("id") || ""
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Fetch consultation details
  useEffect(() => {
    const fetchConsultation = async () => {
      if (!consultationId) {
        router.push("/home")
        return
      }

      try {
        setLoading(true)
        const data = await consultationsAPI.get(consultationId) as any
        setConsultation(data)
      } catch (error) {
        console.error("Failed to fetch consultation:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConsultation()
  }, [consultationId, router])

  const handleSubmit = async () => {
    if (!consultationId || rating === 0) return

    try {
      setSubmitting(true)
      await consultationsAPI.review(consultationId, {
        rating,
        review: feedback
      })
      router.push("/home")
    } catch (error) {
      console.error("Failed to submit feedback:", error)
      // Still redirect on error
      router.push("/home")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-6">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-foreground">Rate Your Experience</h1>
          <p className="text-muted-foreground">Help us improve our service</p>
        </div>

        <GlassmorphicCard className="mb-6 p-6">
          <div className="mb-6 flex flex-col items-center">
            <Avatar className="mb-3 h-20 w-20">
              <AvatarImage src={consultation?.astrologerAvatar || "/indian-astrologer-male.jpg"} />
              <AvatarFallback>{consultation?.astrologerName?.substring(0, 2).toUpperCase() || "AS"}</AvatarFallback>
            </Avatar>
            <h2 className="font-semibold text-foreground">{consultation?.astrologerName || "Loading..."}</h2>
            <p className="text-sm text-muted-foreground">{consultation?.type || "Consultation"}</p>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <p className="mb-3 text-center text-sm font-medium text-foreground">How was your consultation?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                  <Star
                    className={`h-10 w-10 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="mb-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <MessageSquare className="h-4 w-4" />
              Share your feedback (Optional)
            </label>
            <Textarea
              placeholder="Tell us about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </GlassmorphicCard>

        <Button onClick={handleSubmit} className="w-full" size="lg" disabled={rating === 0 || submitting || loading}>
          {submitting ? "Submitting..." : "Submit Feedback"}
        </Button>

        <Button onClick={() => router.push("/home")} variant="ghost" className="mt-3 w-full">
          Skip for Now
        </Button>
      </div>
    </div>
  )
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-6">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-foreground">Rate Your Experience</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <FeedbackContent />
    </Suspense>
  )
}
