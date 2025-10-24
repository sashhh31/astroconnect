"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, Eye, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { BottomNav } from "@/components/bottom-nav"

const blogPosts = [
  {
    id: 1,
    title: "Understanding Your Birth Chart: A Beginner's Guide",
    excerpt: "Learn how to read and interpret your birth chart with this comprehensive guide for beginners...",
    category: "Vedic Astrology",
    readTime: "5 min read",
    views: 1234,
    likes: 89,
    image: "/astrology-birth-chart.jpg",
    date: "2 days ago",
  },
  {
    id: 2,
    title: "Mercury Retrograde: What It Really Means",
    excerpt: "Debunking myths and understanding the real effects of Mercury retrograde on your daily life...",
    category: "Planetary Movements",
    readTime: "4 min read",
    views: 2156,
    likes: 145,
    image: "/mercury-retrograde-planets.png",
    date: "5 days ago",
  },
  {
    id: 3,
    title: "Love Compatibility: Finding Your Perfect Match",
    excerpt: "Discover how zodiac signs influence romantic relationships and find your ideal partner...",
    category: "Relationships",
    readTime: "6 min read",
    views: 3421,
    likes: 234,
    image: "/zodiac-love-compatibility.jpg",
    date: "1 week ago",
  },
  {
    id: 4,
    title: "Career Success Through Astrology",
    excerpt: "How to use astrological insights to advance your career and achieve professional goals...",
    category: "Career",
    readTime: "7 min read",
    views: 1876,
    likes: 112,
    image: "/career-success-astrology.jpg",
    date: "1 week ago",
  },
]

export default function BlogPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-background to-background/80 backdrop-blur-lg">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Astrology Blog</h1>
            <p className="text-sm text-muted-foreground">Latest articles and insights</p>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="space-y-4 px-4 py-4">
        {blogPosts.map((post) => (
          <GlassmorphicCard
            key={post.id}
            className="cursor-pointer overflow-hidden p-0 transition-all hover:shadow-xl"
            onClick={() => router.push(`/blog/${post.id}`)}
          >
            <div className="aspect-video w-full overflow-hidden">
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </div>
              <h2 className="mb-2 text-lg font-semibold text-foreground">{post.title}</h2>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
              <div className="flex items-center justify-between border-t pt-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.views}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Heart className="h-3 w-3" />
                  {post.likes}
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
