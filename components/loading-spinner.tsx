export function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

        {/* Inner pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-primary to-secondary opacity-20" />
        </div>

        {/* Center logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
        </div>
      </div>
    </div>
  )
}

import { Sparkles } from "lucide-react"
