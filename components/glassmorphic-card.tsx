import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassmorphicCardProps {
  children: ReactNode
  className?: string
  gradient?: boolean
}

export function GlassmorphicCard({ children, className, gradient = false }: GlassmorphicCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md shadow-lg",
        gradient && "bg-gradient-to-br from-white/90 to-white/70",
        className,
      )}
    >
      {children}
    </div>
  )
}
