"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, HelpCircle, MessageCircle, Phone, Mail, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"

const supportOptions = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team",
    action: "Start Chat",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "+91 1800-123-4567 (Toll Free)",
    action: "Call Now",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "support@anytimepooja.app",
    action: "Send Email",
  },
]

const faqs = [
  {
    question: "How do I recharge my wallet?",
    answer: "Go to Wallet section and click on Recharge button",
  },
  {
    question: "How to book a consultation?",
    answer: "Select an astrologer and choose chat, call or video option",
  },
  {
    question: "What are the payment methods?",
    answer: "We accept UPI, Cards, Net Banking and Wallets",
  },
  {
    question: "How do I get a refund?",
    answer: "Contact support within 24 hours of consultation",
  },
]

export default function SupportPage() {
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
            <HelpCircle className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold">Help & Support</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Contact Options */}
        <div className="mb-6 space-y-3">
          {supportOptions.map((option) => {
            const Icon = option.icon
            return (
              <GlassmorphicCard key={option.title} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  <Button size="sm">{option.action}</Button>
                </div>
              </GlassmorphicCard>
            )
          })}
        </div>

        {/* FAQs */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <GlassmorphicCard key={index} className="cursor-pointer p-4 transition-all hover:shadow-xl">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="mb-1 font-medium text-foreground">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                </div>
              </GlassmorphicCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
