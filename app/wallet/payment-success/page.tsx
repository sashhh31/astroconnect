"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"

export default function PaymentSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push("/wallet")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-6">
      <GlassmorphicCard className="w-full max-w-md p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-50 p-6">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-foreground">Payment Successful!</h1>
        <p className="mb-6 text-muted-foreground">Your wallet has been recharged successfully</p>

        <div className="mb-6 rounded-lg bg-muted/50 p-4">
          <p className="mb-1 text-sm text-muted-foreground">Amount Added</p>
          <p className="text-3xl font-bold text-primary">₹500</p>
          <p className="mt-2 text-sm text-green-600">+₹50 Bonus Added</p>
        </div>

        <div className="space-y-3">
          <Button onClick={() => router.push("/wallet")} className="w-full gap-2" size="lg">
            Go to Wallet
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button onClick={() => router.push("/home")} variant="outline" className="w-full">
            Back to Home
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">Redirecting to wallet in 5 seconds...</p>
      </GlassmorphicCard>
    </div>
  )
}
