"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { astrologersAPI, horoscopeAPI } from "@/lib/client/api"
import {
  Heart,
  Briefcase,
  HeartPulse,
  DollarSign,
  Users,
  GraduationCap,
  HomeIcon,
  Sparkles,
  Bell,
  Search,
  Star,
  Phone,
  Video,
  MessageCircle,
  ChevronRight,
  TrendingUp,
  Zap,
  Gift,
  Clock,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { BottomNav } from "@/components/bottom-nav"
import { NotificationPanel } from "@/components/notification-panel"
import Image from "next/image"

const categories = [
  { id: "love", name: "Love", icon: Heart, color: "text-pink-500", bg: "bg-pink-50" },
  { id: "career", name: "Career", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "health", name: "Health", icon: HeartPulse, color: "text-green-500", bg: "bg-green-50" },
  { id: "finance", name: "Finance", icon: DollarSign, color: "text-yellow-600", bg: "bg-yellow-50" },
  { id: "marriage", name: "Marriage", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
  { id: "education", name: "Education", icon: GraduationCap, color: "text-indigo-500", bg: "bg-indigo-50" },
  { id: "property", name: "Property", icon: HomeIcon, color: "text-orange-500", bg: "bg-orange-50" },
  { id: "general", name: "General", icon: Sparkles, color: "text-primary", bg: "bg-primary/10" },
]

// Moved to state - will be fetched from API

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)
  const [revealedSections, setRevealedSections] = useState<Set<number>>(new Set())
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const [topAstrologers, setTopAstrologers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch astrologers from API
  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        const response = await astrologersAPI.list(1, 3)
        setTopAstrologers(response.astrologers || [])
      } catch (error) {
        console.error('Failed to fetch astrologers:', error)
        // Fallback to mock data
        setTopAstrologers([
          {
            id: "1",
            fullName: "Dr. Rajesh Sharma",
            displayName: "Dr. Rajesh Sharma",
            specialties: ["Vedic Astrology"],
            experienceYears: 15,
            averageRating: 4.9,
            totalReviews: 2340,
            chatRate: 25,
            profileImageUrl: "/indian-astrologer-male.jpg",
            isOnline: true,
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchAstrologers()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) {
              setRevealedSections((prev) => new Set(prev).add(index))
            }
          }
        })
      },
      { threshold: 0.1 },
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-24">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="sticky top-0 z-30 bg-gradient-to-b from-background to-background/80 backdrop-blur-lg">
          <div className="px-4 py-4">
            <div className="mb-4 flex items-center justify-between animate-slide-in-left">
              <div className="flex items-center gap-3">
                <div className="animate-float">
                  <Image src="/logo.png" alt="Anytime Pooja" width={40} height={40} className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gradient-orange">Anytime Pooja</h1>
                  <p className="text-sm font-medium text-muted-foreground">Discover your cosmic path</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full ripple-effect hover-scale transition-smooth"
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="h-5 w-5 text-primary" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive pulse-dot" />
              </Button>
            </div>

            <div className="relative animate-slide-in-right">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <Input
                placeholder="Search astrologers, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 border-2 border-primary/20 focus:border-primary transition-smooth"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 px-4 py-4">
          <div
            ref={(el) => {
              sectionRefs.current[0] = el
            }}
            className={`scroll-reveal ${revealedSections.has(0) ? "revealed" : ""}`}
          >
            <GlassmorphicCard gradient className="overflow-hidden p-0 hover-lift transition-smooth">
              <div className="relative gradient-yellow-orange p-6 animate-pulse-glow">
                <div className="relative z-10">
                  <Badge className="mb-2 bg-white/30 text-white font-bold backdrop-blur-sm">🎉 Special Offer</Badge>
                  <h2 className="mb-1 text-2xl font-extrabold text-white drop-shadow-lg">First Consultation Free!</h2>
                  <p className="mb-3 text-sm font-semibold text-white/95">Get ₹100 bonus on first recharge</p>
                  <Button size="sm" className="bg-white text-primary hover:bg-white/90 font-bold ripple-effect">
                    Claim Now
                  </Button>
                </div>
                <Sparkles className="absolute -right-4 -top-4 h-32 w-32 text-white/20 animate-float" />
                <Gift className="absolute -bottom-2 -left-2 h-24 w-24 text-white/10 animate-bounce-in" />
              </div>
            </GlassmorphicCard>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current[1] = el
            }}
            className={`scroll-reveal ${revealedSections.has(1) ? "revealed" : ""}`}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-foreground">Categories</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary font-bold hover-scale transition-smooth"
                onClick={() => router.push("/categories")}
              >
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {categories.map((category, index) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => router.push(`/category/${category.id}`)}
                    className="flex flex-col items-center gap-2 rounded-xl p-3 transition-smooth hover-lift ripple-effect animate-bounce-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`rounded-xl ${category.bg} p-3 shadow-lg`}>
                      <Icon className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <span className="text-xs font-bold text-foreground">{category.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current[2] = el
            }}
            className={`scroll-reveal ${revealedSections.has(2) ? "revealed" : ""}`}
          >
            <GlassmorphicCard className="p-4 gradient-orange hover-glow transition-smooth">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-white animate-pulse" />
                  <h2 className="text-lg font-extrabold text-white">Flash Deals</h2>
                </div>
                <div className="flex items-center gap-1 text-white">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-bold">2h 45m left</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 ripple-effect">
                  <p className="text-xs text-white/90 font-semibold">Chat Consultation</p>
                  <p className="text-2xl font-extrabold text-white">₹99</p>
                  <p className="text-xs text-white/80 line-through">₹299</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 ripple-effect">
                  <p className="text-xs text-white/90 font-semibold">Call Consultation</p>
                  <p className="text-2xl font-extrabold text-white">₹149</p>
                  <p className="text-xs text-white/80 line-through">₹399</p>
                </div>
              </div>
            </GlassmorphicCard>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current[3] = el
            }}
            className={`scroll-reveal ${revealedSections.has(3) ? "revealed" : ""}`}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-foreground">Top Astrologers</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary font-bold hover-scale transition-smooth"
                onClick={() => router.push("/astrologers")}
              >
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading astrologers...</div>
              ) : topAstrologers.map((astrologer, index) => (
                <GlassmorphicCard
                  key={astrologer.id}
                  className="cursor-pointer p-4 transition-smooth hover-lift glass-card-hover ripple-effect animate-slide-up"
                  onClick={() => router.push(`/astrologer/${astrologer.id}`)}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <Avatar className="h-16 w-16 border-2 border-primary/30">
                        <AvatarImage src={astrologer.profileImageUrl || "/placeholder.svg"} alt={astrologer.fullName} />
                        <AvatarFallback>{astrologer.fullName?.[0] || 'A'}</AvatarFallback>
                      </Avatar>
                      {astrologer.isOnline && (
                        <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-green-500 pulse-dot" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{astrologer.displayName || astrologer.fullName}</h3>
                      <p className="text-sm font-semibold text-muted-foreground">{astrologer.specialties?.[0] || 'Astrology'}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-secondary text-secondary" />
                          <span className="text-xs font-bold">{astrologer.averageRating || 0}</span>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{astrologer.totalReviews || 0} reviews</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Badge variant="secondary" className="text-xs font-bold">
                        ₹{astrologer.chatRate || 0}/min
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover-scale transition-smooth">
                          <Phone className="h-4 w-4 text-primary" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover-scale transition-smooth">
                          <MessageCircle className="h-4 w-4 text-primary" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </GlassmorphicCard>
              ))}
            </div>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current[4] = el
            }}
            className={`scroll-reveal ${revealedSections.has(4) ? "revealed" : ""}`}
          >
            <GlassmorphicCard className="p-4 hover-lift transition-smooth">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-extrabold text-foreground">Today's Lucky Numbers</h2>
              </div>
              <div className="flex gap-3 justify-center">
                {[7, 14, 21, 28, 35].map((num, index) => (
                  <div
                    key={num}
                    className="h-12 w-12 rounded-full gradient-yellow-orange flex items-center justify-center shadow-lg animate-bounce-in hover-scale transition-smooth"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-xl font-extrabold text-white">{num}</span>
                  </div>
                ))}
              </div>
            </GlassmorphicCard>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current[5] = el
            }}
            className={`scroll-reveal ${revealedSections.has(5) ? "revealed" : ""}`}
          >
            <GlassmorphicCard className="p-4 hover-lift transition-smooth">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-foreground">Today's Horoscope</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary font-bold hover-scale transition-smooth"
                  onClick={() => router.push("/horoscope")}
                >
                  View All
                </Button>
              </div>
              <div className="flex items-center gap-3 rounded-lg gradient-radial-orange p-4 ripple-effect cursor-pointer">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm animate-pulse">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">Aries</h3>
                  <p className="text-sm font-medium text-white/90">Today brings new opportunities in career...</p>
                </div>
                <ChevronRight className="h-5 w-5 text-white" />
              </div>
            </GlassmorphicCard>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current[6] = el
            }}
            className={`scroll-reveal ${revealedSections.has(6) ? "revealed" : ""}`}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-foreground">Live Sessions</h2>
              <Badge variant="destructive" className="animate-pulse font-bold">
                🔴 LIVE
              </Badge>
            </div>
            <GlassmorphicCard className="overflow-hidden p-0 hover-lift transition-smooth">
              <div className="relative h-40 gradient-orange">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="h-16 w-16 text-white/40 animate-pulse" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="font-bold text-white">Weekly Predictions with Dr. Sharma</h3>
                  <p className="text-sm font-semibold text-white/90">234 watching now</p>
                </div>
              </div>
            </GlassmorphicCard>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current[7] = el
            }}
            className={`scroll-reveal ${revealedSections.has(7) ? "revealed" : ""}`}
          >
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary animate-pulse" />
              <h2 className="text-xl font-extrabold text-foreground">Trending Topics</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {["Love Compatibility", "Career Growth", "Financial Planning", "Health Tips"].map((topic, index) => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="cursor-pointer whitespace-nowrap px-4 py-2 font-bold hover-scale transition-smooth ripple-effect animate-slide-in-left"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current[8] = el
            }}
            className={`scroll-reveal ${revealedSections.has(8) ? "revealed" : ""}`}
          >
            <h2 className="mb-3 text-xl font-extrabold text-foreground">What Users Say</h2>
            <GlassmorphicCard className="p-4 hover-lift transition-smooth">
              <div className="mb-3 flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/30">
                  <AvatarImage src="/abstract-geometric-shapes.png" />
                  <AvatarFallback>RK</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-foreground">Rahul Kumar</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-secondary text-secondary" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                "Amazing experience! Dr. Sharma's predictions were spot on. Highly recommended for anyone seeking
                guidance."
              </p>
            </GlassmorphicCard>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current[9] = el
            }}
            className={`scroll-reveal ${revealedSections.has(9) ? "revealed" : ""}`}
          >
            <div className="grid grid-cols-2 gap-3">
              <GlassmorphicCard
                className="cursor-pointer p-4 transition-smooth hover-lift ripple-effect"
                onClick={() => router.push("/wallet")}
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full gradient-orange">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-foreground">Recharge Wallet</h3>
                <p className="text-xs font-medium text-muted-foreground">Add money to consult</p>
              </GlassmorphicCard>
              <GlassmorphicCard
                className="cursor-pointer p-4 transition-smooth hover-lift ripple-effect"
                onClick={() => router.push("/blog")}
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full gradient-yellow-orange">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-foreground">Astro Blog</h3>
                <p className="text-xs font-medium text-muted-foreground">Read latest articles</p>
              </GlassmorphicCard>
            </div>
          </div>
        </div>
      </div>

      <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

      <BottomNav />
    </div>
  )
}
