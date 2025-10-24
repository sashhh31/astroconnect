"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bot, Globe, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { StarsBackground } from "@/components/stars-background"

export default function ModeSelectionPage() {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState<"ai" | "offline">("offline")

  const handleContinue = () => {
    if (selectedMode === "offline") {
      // Save selected mode to localStorage
      localStorage.setItem("astro_mode", "offline")
      router.push("/home")
    } else if (selectedMode === "ai") {
      // Save AI mode selection
      localStorage.setItem("astro_mode", "ai")
      // Show coming soon message (handled by UI state)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/10 px-4 py-12">
      <StarsBackground />

      <div className="relative z-10 mx-auto max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Choose Your Experience</h1>
          <p className="text-muted-foreground">Select how you'd like to explore astrology</p>
        </div>

        {/* Mode Cards */}
        <div className="space-y-4">
          {/* AI Agent Mode */}
          <GlassmorphicCard
            className={`cursor-pointer p-6 transition-all hover:shadow-xl ${selectedMode === "ai" ? "ring-2 ring-accent" : ""}`}
            onClick={() => setSelectedMode("ai")}
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-accent/10 p-3">
                <Bot className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-semibold text-foreground">AI Agent Mode</h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  Instant AI-powered astrology predictions and guidance
                </p>
                <div className="inline-flex items-center gap-1 rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary-foreground">
                  <Sparkles className="h-3 w-3" />
                  Coming Soon
                </div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Offline App Mode */}
          <GlassmorphicCard
            className={`cursor-pointer p-6 transition-all hover:shadow-xl ${
              selectedMode === "offline" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedMode("offline")}
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-semibold text-foreground">Offline App Mode</h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  Connect with professional astrologers via chat, audio & video
                </p>
                <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Recommended
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={selectedMode === "ai"}
          className="mt-8 w-full rounded-xl py-6 text-base font-semibold"
          size="lg"
        >
          {selectedMode === "ai" ? "Coming Soon" : "Continue"}
          {selectedMode === "offline" && <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>

        {/* Info Text */}
        <p className="mt-6 text-center text-xs text-muted-foreground">You can switch modes anytime from Settings</p>
      </div>
    </div>
  )
}
