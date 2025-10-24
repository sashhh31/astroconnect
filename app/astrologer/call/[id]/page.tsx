"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Phone, Mic, MicOff, PhoneOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { callAPI, astrologerAPI } from "@/lib/client/api"

export default function AstrologerCallPage() {
  const router = useRouter()
  const params = useParams()
  const consultationId = params.id as string
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [consultation, setConsultation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const data = await astrologerAPI.getConsultation(consultationId) as any
        setConsultation(data)
        setDuration(data.duration || 0)
        
        // Get Agora token for call
        const tokenData = await callAPI.getToken(consultationId) as any
        console.log("Agora token:", tokenData)
      } catch (error) {
        console.error("Failed to fetch consultation:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConsultation()

    const interval = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [consultationId])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleEndCall = async () => {
    try {
      await astrologerAPI.endConsultation(consultationId)
      router.push("/astrologer/consultations")
    } catch (error) {
      console.error("Failed to end call:", error)
      router.push("/astrologer/consultations")
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-between bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-500 p-8">
      {/* Top Section */}
      <div className="w-full text-center text-white">
        <p className="mb-2 text-sm font-medium opacity-90">Voice Call</p>
        <p className="text-lg font-bold">{formatDuration(duration)}</p>
        <p className="mt-1 text-sm opacity-75">₹{((duration / 60) * (consultation?.rate || 15)).toFixed(0)} earned</p>
      </div>

      {/* Center - User Avatar */}
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
            <AvatarImage src="/placeholder.svg?height=128&width=128" />
            <AvatarFallback className="bg-white text-4xl text-orange-600">PS</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-green-500 px-3 py-1">
            <p className="text-xs font-bold text-white">Connected</p>
          </div>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-white">{consultation?.userName || consultation?.user?.name || "User"}</h2>
        <p className="text-sm text-white/80">Client</p>
      </div>

      {/* Bottom - Controls */}
      <div className="flex w-full items-center justify-center gap-6">
        <Button
          onClick={() => setIsMuted(!isMuted)}
          size="icon"
          className={`h-16 w-16 rounded-full shadow-lg ${
            isMuted ? "bg-gray-600 hover:bg-gray-700" : "bg-white/20 hover:bg-white/30"
          }`}
        >
          {isMuted ? <MicOff className="h-7 w-7 text-white" /> : <Mic className="h-7 w-7 text-white" />}
        </Button>

        <Button
          onClick={handleEndCall}
          size="icon"
          className="h-20 w-20 rounded-full bg-red-500 shadow-2xl hover:bg-red-600"
        >
          <PhoneOff className="h-8 w-8 text-white" />
        </Button>

        <Button size="icon" className="h-16 w-16 rounded-full bg-white/20 shadow-lg hover:bg-white/30">
          <Phone className="h-7 w-7 text-white" />
        </Button>
      </div>
    </div>
  )
}
