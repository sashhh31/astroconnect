"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Sun, Moon, Star, Sparkles } from "lucide-react"

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login")
    }, 2500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <div className="absolute inset-0 opacity-20">
        <Sun className="absolute left-[10%] top-[15%] h-12 w-12 animate-float-slow text-orange-500" />
        <Moon className="absolute right-[15%] top-[20%] h-10 w-10 animate-float-delayed text-orange-600" />
        <Star className="absolute left-[20%] bottom-[25%] h-8 w-8 animate-float-slow text-yellow-600" />
        <Sparkles className="absolute right-[10%] bottom-[30%] h-10 w-10 animate-float-delayed text-orange-500" />
        <Sun className="absolute left-[80%] top-[40%] h-6 w-6 animate-float-slow text-yellow-500" />
        <Star className="absolute left-[15%] top-[60%] h-6 w-6 animate-float-delayed text-orange-400" />
        <Moon className="absolute right-[25%] bottom-[15%] h-8 w-8 animate-float-slow text-yellow-600" />
      </div>

      <div className="relative z-10 animate-fade-in text-center">
        <div className="mb-8 flex justify-center">
          <div className="animate-bounce-slow">
            <Image src="/logo.png" alt="Anytime Pooja Logo" width={120} height={120} className="drop-shadow-2xl" />
          </div>
        </div>
        <h1 className="mb-3 text-5xl font-extrabold text-orange-600">Anytime Pooja</h1>
        <p className="text-xl font-medium text-orange-500">Your Spiritual Companion</p>
      </div>
    </div>
  )
}
