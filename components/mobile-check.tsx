"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"

export function MobileCheck() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth > 1024)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)

    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  if (!isDesktop) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-sm">
      <div className="mx-4 max-w-md rounded-2xl bg-card p-8 text-center shadow-2xl">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="mb-3 text-2xl font-bold text-foreground">Mobile Experience Only</h1>
        <p className="mb-2 text-muted-foreground">
          AstroConnect is designed exclusively for mobile and tablet devices.
        </p>
        <p className="text-sm text-muted-foreground">
          Please access this app from your smartphone or tablet for the best experience.
        </p>
      </div>
    </div>
  )
}
