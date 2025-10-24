"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Share2, Copy, Check, Gift, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassmorphicCard } from "@/components/glassmorphic-card"

export default function ReferralPage() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const referralCode = "ASTRO2024RK"
  const referralLink = `https://anytimepooja.app/ref/${referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Anytime Pooja",
          text: `Use my referral code ${referralCode} and get ₹100 bonus on signup!`,
          url: referralLink,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
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
            <Gift className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold">Refer & Earn</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Reward Banner */}
        <GlassmorphicCard gradient className="mb-6 overflow-hidden p-0">
          <div className="relative bg-gradient-to-br from-primary via-secondary to-accent p-6 text-center">
            <Gift className="mx-auto mb-3 h-16 w-16 text-white" />
            <h2 className="mb-2 text-2xl font-bold text-white">Earn ₹100 Per Referral</h2>
            <p className="text-white/90">
              Invite your friends and get ₹100 when they complete their first consultation
            </p>
          </div>
        </GlassmorphicCard>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <GlassmorphicCard className="p-4 text-center">
            <Users className="mx-auto mb-2 h-8 w-8 text-primary" />
            <p className="mb-1 text-2xl font-bold text-primary">5</p>
            <p className="text-xs text-muted-foreground">Friends Invited</p>
          </GlassmorphicCard>
          <GlassmorphicCard className="p-4 text-center">
            <Gift className="mx-auto mb-2 h-8 w-8 text-secondary" />
            <p className="mb-1 text-2xl font-bold text-secondary">₹300</p>
            <p className="text-xs text-muted-foreground">Total Earned</p>
          </GlassmorphicCard>
        </div>

        {/* Referral Code */}
        <GlassmorphicCard className="mb-6 p-4">
          <h3 className="mb-3 font-semibold text-foreground">Your Referral Code</h3>
          <div className="mb-3 flex gap-2">
            <Input value={referralCode} readOnly className="font-mono text-lg" />
            <Button size="icon" onClick={handleCopy} className="flex-shrink-0">
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2 bg-transparent">
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
            <Button onClick={handleShare} className="flex-1 gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </GlassmorphicCard>

        {/* How it Works */}
        <GlassmorphicCard className="p-4">
          <h3 className="mb-4 font-semibold text-foreground">How it Works</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                1
              </div>
              <div>
                <h4 className="font-medium text-foreground">Share your code</h4>
                <p className="text-sm text-muted-foreground">Send your referral code to friends and family</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                2
              </div>
              <div>
                <h4 className="font-medium text-foreground">They sign up</h4>
                <p className="text-sm text-muted-foreground">Your friend registers using your code and gets ₹100</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                3
              </div>
              <div>
                <h4 className="font-medium text-foreground">You both earn</h4>
                <p className="text-sm text-muted-foreground">Get ₹100 when they complete their first consultation</p>
              </div>
            </div>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  )
}
