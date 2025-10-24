"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AuthVideoBackground } from "@/components/auth-video-background"
import Image from "next/image"
import { Star, Users, TrendingUp, Clock } from "lucide-react"

export default function AstrologerLandingPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AuthVideoBackground />

      <div className="relative z-20 flex min-h-screen items-end justify-center pb-0">
        <div className="w-full">
          <div className="mb-6 flex items-center justify-center px-6">
            <div className="relative h-24 w-24 rounded-full bg-white/90 p-4 shadow-lg backdrop-blur-sm">
              <Image src="/logo.png" alt="Anytime Pooja" fill className="object-contain p-3" priority />
            </div>
          </div>

          <div className="rounded-t-[2rem] bg-white/95 p-6 pb-8 shadow-2xl backdrop-blur-md">
            <div className="mb-8 text-center">
              <h1 className="mb-3 text-3xl font-extrabold text-gray-900">Join as Astrologer</h1>
              <p className="text-base text-gray-600">Share your wisdom, earn from anywhere</p>
            </div>

            <div className="mb-8 space-y-4">
              <div className="flex items-start gap-4 rounded-xl bg-orange-50 p-4">
                <div className="rounded-full bg-orange-500 p-2">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Connect with Seekers</h3>
                  <p className="text-sm text-gray-600">Help thousands find their path</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl bg-yellow-50 p-4">
                <div className="rounded-full bg-yellow-500 p-2">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Grow Your Practice</h3>
                  <p className="text-sm text-gray-600">Build your reputation online</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl bg-green-50 p-4">
                <div className="rounded-full bg-green-500 p-2">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Flexible Schedule</h3>
                  <p className="text-sm text-gray-600">Work on your own terms</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl bg-purple-50 p-4">
                <div className="rounded-full bg-purple-500 p-2">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Earn More</h3>
                  <p className="text-sm text-gray-600">Set your rates, get paid instantly</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => router.push("/astrologer/signup")}
                className="h-14 w-full rounded-xl bg-orange-500 text-lg font-bold text-white transition-colors hover:bg-orange-600"
              >
                Start Your Journey
              </Button>

              <Button
                onClick={() => router.push("/astrologer/login")}
                variant="outline"
                className="h-14 w-full rounded-xl border-2 border-orange-500 text-lg font-bold text-orange-600 transition-colors hover:bg-orange-50"
              >
                Already Registered? Login
              </Button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => router.push("/home")}
                className="text-sm font-medium text-gray-600 hover:text-orange-600"
              >
                ← Back to User App
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
