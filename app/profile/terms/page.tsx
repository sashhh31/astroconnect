"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"

export default function TermsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold">Terms & Conditions</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <GlassmorphicCard className="p-6">
          <div className="prose prose-sm max-w-none">
            <p className="mb-4 text-sm text-muted-foreground">Last updated: January 2025</p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              By accessing and using Anytime Pooja, you accept and agree to be bound by the terms and provision of this
              agreement.
            </p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">2. Use of Service</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              You must be at least 18 years old to use this service. You are responsible for maintaining the
              confidentiality of your account and password.
            </p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">3. Consultations</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              All consultations are for entertainment and guidance purposes only. We do not guarantee specific outcomes
              or results from any consultation.
            </p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">4. Payment Terms</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              All payments are processed securely. Wallet recharges are non-refundable except in cases of technical
              errors or service failures.
            </p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">5. Refund Policy</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Refunds for consultations may be requested within 24 hours if there was a technical issue or service was
              not provided as described.
            </p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">6. User Conduct</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Users must maintain respectful communication with astrologers. Abusive or inappropriate behavior may
              result in account suspension.
            </p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">7. Privacy</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use
              your information.
            </p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">8. Changes to Terms</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              We reserve the right to modify these terms at any time. Continued use of the service constitutes
              acceptance of modified terms.
            </p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">9. Contact Us</h2>
            <p className="text-sm text-muted-foreground">
              For questions about these terms, please contact us at support@anytimepooja.app
            </p>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  )
}
