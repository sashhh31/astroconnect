"use client"

import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Star, Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { BottomNav } from "@/components/bottom-nav"

const categoryAstrologers = [
  {
    id: 1,
    name: "Dr. Rajesh Sharma",
    specialty: "Vedic Astrology",
    experience: "15 years",
    rating: 4.9,
    reviews: 2340,
    price: 25,
    image: "/indian-astrologer-male.jpg",
    isOnline: true,
    languages: ["Hindi", "English"],
  },
  {
    id: 2,
    name: "Priya Mehta",
    specialty: "Tarot Reading",
    experience: "10 years",
    rating: 4.8,
    reviews: 1890,
    price: 20,
    image: "/indian-astrologer-female.jpg",
    isOnline: true,
    languages: ["Hindi", "English", "Gujarati"],
  },
  {
    id: 3,
    name: "Amit Patel",
    specialty: "Numerology",
    experience: "12 years",
    rating: 4.7,
    reviews: 1560,
    price: 22,
    image: "/indian-astrologer-male-2.jpg",
    isOnline: false,
    languages: ["Hindi", "English"],
  },
  {
    id: 4,
    name: "Sunita Verma",
    specialty: "KP Astrology",
    experience: "18 years",
    rating: 4.9,
    reviews: 3120,
    price: 30,
    image: "/indian-astrologer-female-2.jpg",
    isOnline: true,
    languages: ["Hindi", "English", "Marathi"],
  },
]

export default function CategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string

  const categoryName = categoryId.charAt(0).toUpperCase() + categoryId.slice(1)

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-background to-background/80 backdrop-blur-lg">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{categoryName} Astrologers</h1>
            <p className="text-sm text-muted-foreground">{categoryAstrologers.length} experts available</p>
          </div>
        </div>
      </div>

      {/* Astrologers List */}
      <div className="space-y-3 px-4 py-4">
        {categoryAstrologers.map((astrologer) => (
          <GlassmorphicCard
            key={astrologer.id}
            className="cursor-pointer p-4 transition-all hover:shadow-xl"
            onClick={() => router.push(`/astrologer/${astrologer.id}`)}
          >
            <div className="flex gap-3">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={astrologer.image || "/placeholder.svg"} alt={astrologer.name} />
                  <AvatarFallback>{astrologer.name[0]}</AvatarFallback>
                </Avatar>
                {astrologer.isOnline && (
                  <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{astrologer.name}</h3>
                <p className="text-sm text-muted-foreground">{astrologer.specialty}</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{astrologer.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{astrologer.reviews} reviews</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {astrologer.languages.map((lang) => (
                    <Badge key={lang} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <div className="text-sm">
                <span className="font-semibold text-primary">₹{astrologer.price}/min</span>
                <span className="text-muted-foreground"> • {astrologer.experience}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <Button size="sm" className="gap-1">
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </Button>
              </div>
            </div>
          </GlassmorphicCard>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
