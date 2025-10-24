"use client"

import { useEffect, useRef } from "react"

export function StarsBackground() {
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const container = canvasRef.current
    const starCount = 50

    // Generate random stars
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div")
      star.className = "star"
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`
      star.style.animationDelay = `${Math.random() * 3}s`
      star.style.animationDuration = `${2 + Math.random() * 3}s`
      container.appendChild(star)
    }

    return () => {
      container.innerHTML = ""
    }
  }, [])

  return <div ref={canvasRef} className="stars-bg" />
}
