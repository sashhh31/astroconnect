"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { astrologersAPI, consultationsAPI } from "@/lib/client/api"
import { ArrowLeft, Star, Phone, MessageCircle, Share2, Heart, Award, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Moved to state - will be fetched from API

export default function AstrologerProfilePage() {
  const router = useRouter()
  const params = useParams()
  const [astrologer, setAstrologer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAstrologer = async () => {
      try {
        const id = params.id as string
        const data = await astrologersAPI.get(id)
        setAstrologer(data)
      } catch (error) {
        console.error('Failed to fetch astrologer:', error)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) {
      fetchAstrologer()
    }
  }, [params.id])

  const handleBookConsultation = async (type: 'chat' | 'voice_call' | 'video_call') => {
    try {
      await consultationsAPI.book({
        astrologerId: params.id as string,
        type,
        duration: 15
      })
      router.push('/profile/history')
    } catch (error) {
      console.error('Failed to book:', error)
      alert('Failed to book consultation')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!astrologer) {
    return <div className="flex items-center justify-center min-h-screen">Astrologer not found</div>
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-background to-background/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Profile Header */}
        <GlassmorphicCard className="mb-4 p-6">
          <div className="flex gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={astrologer.profileImageUrl || "/placeholder.svg"} alt={astrologer.fullName} />
                <AvatarFallback>{astrologer.fullName?.[0] || 'A'}</AvatarFallback>
              </Avatar>
              {astrologer.isOnline && (
                <span className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white bg-green-500" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">{astrologer.displayName || astrologer.fullName}</h1>
              <p className="text-sm text-muted-foreground">{astrologer.specialties?.[0] || 'Astrology'}</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{astrologer.averageRating || 0}</span>
                  <span className="text-xs text-muted-foreground">({astrologer.totalReviews || 0})</span>
                </div>
                <Badge variant="secondary">{astrologer.experienceYears || 0} years</Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {(astrologer.languages || []).map((lang: string) => (
                  <Badge key={lang} variant="outline" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-4">
            <div className="text-center">
              <div className="flex justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">{astrologerData.consultations}+</p>
              <p className="text-xs text-muted-foreground">Consultations</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">{astrologerData.experience}</p>
              <p className="text-xs text-muted-foreground">Experience</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">Top Rated</p>
              <p className="text-xs text-muted-foreground">Astrologer</p>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="expertise">Expertise</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4">
            <GlassmorphicCard className="p-4">
              <h3 className="mb-2 font-semibold text-foreground">About</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{astrologerData.about}</p>
            </GlassmorphicCard>

            <GlassmorphicCard className="p-4">
              <h3 className="mb-3 font-semibold text-foreground">Achievements</h3>
              <div className="space-y-2">
                {astrologerData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{achievement}</span>
                  </div>
                ))}
              </div>
            </GlassmorphicCard>
          </TabsContent>

          <TabsContent value="expertise" className="space-y-3">
            {astrologerData.expertise.map((skill, index) => (
              <GlassmorphicCard key={index} className="p-4">
                <p className="font-medium text-foreground">{skill}</p>
              </GlassmorphicCard>
            ))}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-3">
            {astrologerData.reviews.map((review) => (
              <GlassmorphicCard key={review.id} className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">{review.name}</h4>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <div className="mb-2 flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </GlassmorphicCard>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card/95 p-4 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Consultation Fee</p>
            <p className="text-lg font-bold text-primary">₹{astrologerData.price}/min</p>
          </div>
          <Button size="lg" className="gap-2" onClick={() => router.push(`/consultation/chat/${astrologerData.id}`)}>
            <MessageCircle className="h-5 w-5" />
            Chat
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={() => router.push(`/consultation/call/${astrologerData.id}`)}
          >
            <Phone className="h-5 w-5" />
            Call
          </Button>
        </div>
      </div>
    </div>
  )
}
