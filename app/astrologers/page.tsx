"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Star, Phone, MessageCircle, Search, Filter } from "lucide-react"
import { astrologersAPI } from "@/lib/client/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { BottomNav } from "@/components/bottom-nav"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const astrologers = [
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
    consultations: 5000,
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
    consultations: 3500,
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
    consultations: 2800,
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
    consultations: 6200,
  },
]

export default function AstrologersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [astrologers, setAstrologers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAstrologers = async () => {
      setLoading(true)
      try {
        const response = await astrologersAPI.list(1, 20)
        setAstrologers(response.astrologers || [])
      } catch (error) {
        console.error('Failed to fetch astrologers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAstrologers()
  }, [])

  const filteredAstrologers = astrologers.filter((a) => {
    if (filter === "online") return a.isOnline
    if (filter === "top-rated") return a.rating >= 4.8
    return true
  })

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-background to-background/80 backdrop-blur-lg">
        <div className="px-4 py-4">
          <div className="mb-4 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Our Astrologers</h1>
              <p className="text-sm text-muted-foreground">{filteredAstrologers.length} experts available</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Filter className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Tabs */}
          <Tabs value={filter} onValueChange={setFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
              <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Astrologers List */}
      <div className="space-y-3 px-4 py-4">
        {filteredAstrologers.map((astrologer) => (
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
                <span className="text-muted-foreground"> • {astrologer.consultations}+ consultations</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" className="gap-1">
                  <MessageCircle className="h-4 w-4" />
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
