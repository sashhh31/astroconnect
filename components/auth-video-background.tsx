"use client"

import { useEffect, useRef, useState } from "react"
import { Sparkles, Moon, Sun, Star, Zap } from "lucide-react"

export function AuthVideoBackground() {
  const [mounted, setMounted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const playVideo = async () => {
      try {
        await video.play()
        console.log("[v0] Video playing successfully")
      } catch (error) {
        console.error("Video autoplay failed:", error)
      }
    }

    // Play video when component mounts
    playVideo()

    // Resume video when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden && video.paused) {
        playVideo()
      }
    }

    // Resume video when it ends (backup for loop)
    const handleEnded = () => {
      video.currentTime = 0
      playVideo()
    }

    // Resume video if it pauses unexpectedly
    const handlePause = () => {
      if (!document.hidden) {
        playVideo()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    video.addEventListener("ended", handleEnded)
    video.addEventListener("pause", handlePause)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("pause", handlePause)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <>
      {/* Video Background - Milky Way time-lapse */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover transition-opacity duration-1000"
          style={{ willChange: "transform" }}
          {...({ "webkit-playsinline": "true" } as any)}
        >
          <source
            src="https://any-timepooja.s3.ap-south-1.amazonaws.com/vecteezy_time-lapse-shot-of-milky-way-over-mountain-and-trees-against_49757124+(1).mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Floating Astrology Icons from Left */}
      <div className="fixed left-0 top-0 z-10 h-full w-20 pointer-events-none">
        <div className="animate-float-slow absolute left-4 top-[15%]">
          <Sun className="h-8 w-8 text-orange-400 opacity-60" />
        </div>
        <div className="animate-float-delayed absolute left-6 top-[35%]">
          <Star className="h-6 w-6 text-yellow-500 opacity-50" />
        </div>
        <div className="animate-float-slow absolute left-3 top-[55%]">
          <Sparkles className="h-7 w-7 text-orange-500 opacity-60" />
        </div>
        <div className="animate-float-delayed absolute left-5 top-[75%]">
          <Moon className="h-8 w-8 text-yellow-400 opacity-50" />
        </div>
      </div>

      {/* Floating Astrology Icons from Right */}
      <div className="fixed right-0 top-0 z-10 h-full w-20 pointer-events-none">
        <div className="animate-float-delayed absolute right-4 top-[20%]">
          <Moon className="h-8 w-8 text-orange-400 opacity-60" />
        </div>
        <div className="animate-float-slow absolute right-6 top-[40%]">
          <Zap className="h-6 w-6 text-yellow-500 opacity-50" />
        </div>
        <div className="animate-float-delayed absolute right-3 top-[60%]">
          <Star className="h-7 w-7 text-orange-500 opacity-60" />
        </div>
        <div className="animate-float-slow absolute right-5 top-[80%]">
          <Sparkles className="h-8 w-8 text-yellow-400 opacity-50" />
        </div>
      </div>
    </>
  )
}
