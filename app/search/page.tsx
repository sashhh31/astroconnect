"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, ArrowLeft, Filter, Star, Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { astrologersAPI } from "@/lib/client/api"

interface Astrologer {
  id: string
  name: string
  specialty: string
  experience: string
  rating: number
  reviews: number
  price: number
  image?: string
  isOnline: boolean
  languages: string[]
}

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [filteredResults, setFilteredResults] = useState<Astrologer[]>([])
  const [loading, setLoading] = useState(false)
  const [allAstrologers, setAllAstrologers] = useState<Astrologer[]>([])

  // Fetch astrologers on mount
  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        setLoading(true)
        const data = await astrologersAPI.search(searchQuery || "") as any
        const astrologers = (data.astrologers || data || []).map((a: any) => ({
          id: a.id,
          name: a.name || a.fullName,
          specialty: a.specialization || a.specialty || "Astrology",
          experience: a.experience || "5 years",
          rating: a.rating || 4.5,
          reviews: a.totalReviews || a.reviews || 0,
          price: a.rate || a.price || 20,
          image: a.avatar || a.image,
          isOnline: a.isOnline || false,
          languages: a.languages || ["Hindi", "English"]
        }))
        setAllAstrologers(astrologers)
        setFilteredResults(astrologers)
      } catch (error) {
        console.error("Failed to fetch astrologers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAstrologers()
  }, [])

  // Filter results based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = allAstrologers.filter(
        (astrologer) =>
          astrologer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          astrologer.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          astrologer.languages.some((lang) => lang.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredResults(results)
    } else {
      setFilteredResults(allAstrologers)
    }
  }, [searchQuery, allAstrologers])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-4">
          <div className="mb-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search astrologers, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
            <Button variant="ghost" size="icon">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-4">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
        {!loading && (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>

          {filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="mb-4 h-16 w-16 text-muted-foreground/20" />
            <h3 className="mb-2 text-lg font-semibold">No results found</h3>
            <p className="text-sm text-muted-foreground">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredResults.map((astrologer) => (
              <GlassmorphicCard
                key={astrologer.id}
                className="cursor-pointer p-4 transition-all hover:shadow-xl"
                onClick={() => router.push(`/astrologer/${astrologer.id}`)}
              >
                <div className="flex gap-3">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
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
                    <div className="mt-1 flex gap-1">
                      {astrologer.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Badge variant="secondary" className="text-xs">
                      ₹{astrologer.price}/min
                    </Badge>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>
            ))}
          </div>
          )}
        </>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchContent />
    </Suspense>
  )
}
