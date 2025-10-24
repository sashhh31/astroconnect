"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { AuthVideoBackground } from "@/components/auth-video-background"
import { astrologerAPI } from "@/lib/client/api"

export default function AstrologerLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await astrologerAPI.login({ email, password }) as any
      
      if (response.token || response.accessToken) {
        localStorage.setItem("accessToken", response.token || response.accessToken)
        localStorage.setItem("astrologer_logged_in", "true")
        router.push("/astrologer/dashboard")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AuthVideoBackground />

      <div className="relative z-20 flex min-h-screen items-end justify-center pb-0">
        <div className="w-full">
          <div className="mb-6 flex items-center justify-between px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Button>
            <div className="relative h-20 w-20 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm">
              <Image src="/logo.png" alt="Anytime Pooja" fill className="object-contain p-2" priority />
            </div>
            <div className="w-10" />
          </div>

          <div className="rounded-t-[2rem] bg-white/95 p-6 pb-8 shadow-2xl backdrop-blur-md">
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">Astrologer Login</h1>
              <p className="text-sm text-gray-600">Welcome back!</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <Button
                onClick={handleLogin}
                className="h-12 w-full rounded-xl bg-orange-500 text-base font-bold text-white transition-colors hover:bg-orange-600"
                disabled={!email || !password || loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New astrologer?{" "}
                <button
                  onClick={() => router.push("/astrologer/signup")}
                  className="font-bold text-orange-600 transition-colors hover:text-orange-700"
                >
                  Register Now
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
