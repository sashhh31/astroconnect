"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"

export default function PrivacyPage() {
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
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold">Privacy Policy</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <GlassmorphicCard className="p-6">
          <div className="prose prose-sm max-w-none">
            <p className="mb-4 text-sm text-muted-foreground">Last updated: January 2025</p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">1. Information We Collect</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              We collect information you provide directly to us, including name, email, phone number, date of birth, and
              payment information when you register or use our services.
            </p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              We use your information to provide consultations, process payments, send notifications, improve our
              services, and communicate with you about your account.
            </p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">3. Information Sharing</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              We share your information with astrologers only to the extent necessary to provide consultations. We do
              not sell your personal information to third parties.
            </p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">4. Data Security</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              We implement appropriate security measures to protect your personal information. However, no method of
              transmission over the internet is 100% secure.
            </p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">5. Cookies and Tracking</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              We use cookies and similar tracking technologies to track activity on our service and hold certain
              information to improve user experience.
            </p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">6. Your Rights</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              You have the right to access, update, or delete your personal information. You can do this through your
              account settings or by contacting us.
            </p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">7. Children's Privacy</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Our service is not intended for children under 18. We do not knowingly collect personal information from
              children under 18.
            </p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">8. Changes to Privacy Policy</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page.
            </p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">9. Contact Us</h2>
            <p className="text-sm text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at privacy@anytimepooja.app
            </p>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  )
}
