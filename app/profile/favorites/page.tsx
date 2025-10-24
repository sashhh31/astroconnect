"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, Star, Phone, MessageCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassmorphicCard } from "@/components/glassmorphic-card"

// Moved to state - will be fetched from API

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/user/favorites', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        const data = await response.json()
        setFavorites(data.data?.favorites || [])
      } catch (error) {
        console.error('Failed to fetch favorites:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFavorites()
  }, [])

  const handleRemoveFavorite = async (astrologerId: string) => {
    try {
      await fetch(`/api/user/favorites/${astrologerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      setFavorites(favorites.filter(f => f.astrologerId !== astrologerId))
    } catch (error) {
      console.error('Failed to remove favorite:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold">Favorite Astrologers</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="mb-4 h-16 w-16 text-muted-foreground/20" />
            <h3 className="mb-2 text-lg font-semibold">No favorites yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">Add astrologers to your favorites for quick access</p>
            <Button onClick={() => router.push("/astrologers")}>Browse Astrologers</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((fav) => (
              <GlassmorphicCard key={fav.astrologerId} className="p-4">
                <div className="flex gap-3">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={fav.astrologer?.profileImageUrl || "/placeholder.svg"} alt={fav.astrologer?.fullName} />
                      <AvatarFallback>{fav.astrologer?.fullName?.[0] || 'A'}</AvatarFallback>
                    </Avatar>
                    {fav.astrologer?.isOnline && (
                      <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{fav.astrologer?.displayName || fav.astrologer?.fullName}</h3>
                    <p className="text-sm text-muted-foreground">{fav.astrologer?.specialties?.[0] || 'Astrology'}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{fav.astrologer?.averageRating || 0}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{fav.astrologer?.totalReviews || 0} reviews</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleRemoveFavorite(fav.astrologerId)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Badge variant="secondary" className="text-xs">
                      ₹{fav.astrologer?.chatRate || 0}/min
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => router.push(`/consultation/call/${fav.astrologerId}`)}
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-2 bg-transparent"
                    onClick={() => router.push(`/consultation/chat/${fav.astrologerId}`)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat
                  </Button>
                </div>
              </GlassmorphicCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
