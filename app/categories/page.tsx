"use client"

import { useRouter } from "next/navigation"
import {
  Heart,
  Briefcase,
  HeartPulse,
  DollarSign,
  Users,
  GraduationCap,
  HomeIcon,
  Sparkles,
  ArrowLeft,
  Baby,
  Scale,
  Globe,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { BottomNav } from "@/components/bottom-nav"

const allCategories = [
  {
    id: "love",
    name: "Love & Relationships",
    icon: Heart,
    color: "text-pink-500",
    bg: "bg-pink-50",
    description: "Find answers about your love life and relationships",
  },
  {
    id: "career",
    name: "Career & Business",
    icon: Briefcase,
    color: "text-blue-500",
    bg: "bg-blue-50",
    description: "Get guidance on your professional journey",
  },
  {
    id: "health",
    name: "Health & Wellness",
    icon: HeartPulse,
    color: "text-green-500",
    bg: "bg-green-50",
    description: "Insights about your physical and mental health",
  },
  {
    id: "finance",
    name: "Finance & Wealth",
    icon: DollarSign,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    description: "Financial planning and wealth predictions",
  },
  {
    id: "marriage",
    name: "Marriage & Family",
    icon: Users,
    color: "text-purple-500",
    bg: "bg-purple-50",
    description: "Marriage compatibility and family matters",
  },
  {
    id: "education",
    name: "Education & Learning",
    icon: GraduationCap,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    description: "Academic success and learning guidance",
  },
  {
    id: "property",
    name: "Property & Assets",
    icon: HomeIcon,
    color: "text-orange-500",
    bg: "bg-orange-50",
    description: "Real estate and property investments",
  },
  {
    id: "children",
    name: "Children & Parenting",
    icon: Baby,
    color: "text-cyan-500",
    bg: "bg-cyan-50",
    description: "Child birth and parenting guidance",
  },
  {
    id: "legal",
    name: "Legal & Court Cases",
    icon: Scale,
    color: "text-red-500",
    bg: "bg-red-50",
    description: "Legal matters and court case predictions",
  },
  {
    id: "travel",
    name: "Travel & Foreign",
    icon: Globe,
    color: "text-teal-500",
    bg: "bg-teal-50",
    description: "Foreign travel and settlement abroad",
  },
  {
    id: "spiritual",
    name: "Spiritual Growth",
    icon: Zap,
    color: "text-violet-500",
    bg: "bg-violet-50",
    description: "Spiritual awakening and inner peace",
  },
  {
    id: "general",
    name: "General Consultation",
    icon: Sparkles,
    color: "text-primary",
    bg: "bg-primary/10",
    description: "Comprehensive life guidance and predictions",
  },
]

export default function CategoriesPage() {
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
            <h1 className="text-xl font-bold text-foreground">All Categories</h1>
            <p className="text-sm text-muted-foreground">Choose your consultation area</p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-3 px-4 py-4">
        {allCategories.map((category) => {
          const Icon = category.icon
          return (
            <GlassmorphicCard
              key={category.id}
              className="cursor-pointer p-4 transition-all hover:shadow-xl"
              onClick={() => router.push(`/category/${category.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-xl ${category.bg} p-4`}>
                  <Icon className={`h-7 w-7 ${category.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
            </GlassmorphicCard>
          )
        })}
      </div>

      <BottomNav />
    </div>
  )
}
