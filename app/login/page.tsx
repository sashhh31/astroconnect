"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Phone, Mail, AlertCircle } from "lucide-react"
import { authAPI } from "@/lib/client/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { AuthVideoBackground } from "@/components/auth-video-background"

export default function LoginPage() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handlePhoneLogin = async () => {
    setLoading(true)
    setError("")
    try {
      // Send OTP via backend
      await fetch('/api/user/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${phoneNumber}` })
      })
      localStorage.setItem("astro_phone", phoneNumber)
      router.push("/otp-verify?phone=" + phoneNumber)
    } catch (err: any) {
      setError(err.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async () => {
    setError("")
    setLoading(true)
    try {
      const response = await authAPI.login({ email, password })
      localStorage.setItem("accessToken", response.accessToken)
      localStorage.setItem("refreshToken", response.refreshToken)
      localStorage.setItem("astro_user", JSON.stringify(response.user))
      router.push("/mode-selection")
    } catch (err: any) {
      setError(err.message || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AuthVideoBackground />

      <div className="relative z-20 flex min-h-screen items-end justify-center pb-0">
        <div className="w-full">
          {/* Logo positioned above card */}
          <div className="mb-6 flex justify-center">
            <div className="relative h-24 w-24 rounded-full bg-white/90 p-4 shadow-lg backdrop-blur-sm">
              <Image src="/logo.png" alt="Anytime Pooja" fill className="object-contain p-2" priority />
            </div>
          </div>

          <div className="rounded-t-[2rem] bg-white/95 p-6 pb-8 shadow-2xl backdrop-blur-md">
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-sm text-gray-600">Sign in to continue</p>
            </div>

            <Tabs defaultValue="email" className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger
                  value="email"
                  className="gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger
                  value="phone"
                  className="gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  <Phone className="h-4 w-4" />
                  Phone
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@admin.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError("")
                    }}
                    className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError("")
                    }}
                    className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>

                <Button
                  onClick={handleEmailLogin}
                  className="w-full h-12 text-base font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors rounded-xl"
                  disabled={!email || !password || loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="rounded-lg bg-orange-50 p-3 text-center text-xs text-orange-700 border border-orange-100">
                  Demo: admin@admin.com / admin
                </div>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone Number
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex h-12 w-14 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-12 flex-1 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      maxLength={10}
                    />
                  </div>
                </div>
                <Button
                  onClick={handlePhoneLogin}
                  className="w-full h-12 text-base font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors rounded-xl"
                  disabled={phoneNumber.length !== 10 || loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => router.push("/signup")}
                  className="font-bold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
