"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Phone, Mic, MicOff, Volume2, VolumeX, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { consultationsAPI, callAPI } from "@/lib/client/api"
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng"

interface Consultation {
  id: string
  astrologerId: string
  astrologerName: string
  astrologerAvatar?: string
  status: string
  type: string
  startTime: string
  rate: number
}

export default function CallConsultationPage() {
  const router = useRouter()
  const params = useParams()
  const consultationId = params.id as string
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [callStatus, setCallStatus] = useState<"connecting" | "connected" | "error">("connecting")
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [loading, setLoading] = useState(true)
  const [agoraClient, setAgoraClient] = useState<IAgoraRTCClient | null>(null)

  // Fetch consultation and initialize Agora
  useEffect(() => {
    const initCall = async () => {
      try {
        setLoading(true)
        
        // Fetch consultation details
        const consultationData = await consultationsAPI.get(consultationId) as any
        setConsultation(consultationData)

        // Get Agora token
        const { token, channelName, uid, appId } = await callAPI.getToken(consultationId)

        // Initialize Agora client
        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
        setAgoraClient(client)

        // Join channel
        await client.join(appId, channelName, token, uid)
        
        // Create and publish audio track
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
        await client.publish([audioTrack])

        setCallStatus("connected")

        // Calculate duration
        if (consultationData.startTime) {
          const start = new Date(consultationData.startTime).getTime()
          const now = Date.now()
          setDuration(Math.floor((now - start) / 1000))
        }
      } catch (error) {
        console.error("Failed to initialize call:", error)
        setCallStatus("error")
      } finally {
        setLoading(false)
      }
    }

    initCall()

    return () => {
      // Cleanup Agora
      if (agoraClient) {
        agoraClient.leave()
      }
    }
  }, [consultationId])

  useEffect(() => {
    if (callStatus === "connected") {
      const timer = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [callStatus])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleEndCall = async () => {
    try {
      // End consultation
      await consultationsAPI.end(consultationId)
      
      // Leave Agora channel
      if (agoraClient) {
        await agoraClient.leave()
      }
      
      router.push("/consultation/feedback")
    } catch (error) {
      console.error("Failed to end call:", error)
      router.push("/consultation/feedback")
    }
  }

  const handleToggleMute = async () => {
    if (agoraClient) {
      const audioTrack = agoraClient.localTracks.find(track => track.trackMediaType === "audio")
      if (audioTrack) {
        await audioTrack.setEnabled(isMuted)
      }
    }
    setIsMuted(!isMuted)
  }

  return (
    <div className="relative flex h-screen flex-col items-center justify-between bg-gradient-to-br from-primary via-secondary to-accent p-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 animate-pulse rounded-full bg-white/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-white/80">
            <p className="text-sm">Audio Call</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        {/* Profile */}
        <div className="mt-20 flex flex-col items-center">
          <div className="relative mb-6">
            <Avatar className="h-32 w-32 border-4 border-white/20">
              <AvatarImage src="/indian-astrologer-male.jpg" />
              <AvatarFallback>RS</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <div className="rounded-full bg-white/20 px-4 py-1 backdrop-blur-sm">
                <p className="text-xs font-medium text-white">
                  {callStatus === "connecting" ? "Connecting..." : formatDuration(duration)}
                </p>
              </div>
            </div>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-white">{consultation?.astrologerName || "Loading..."}</h1>
          <p className="text-white/80">{callStatus === "error" ? "Connection Error" : "Audio Call"}</p>

          {callStatus === "connecting" && (
            <div className="mt-6 flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-white delay-100" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-white delay-200" />
            </div>
          )}
        </div>

        {/* Call Info */}
        {callStatus === "connected" && (
          <div className="mt-12 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Call Rate</p>
                <p className="font-semibold text-white">₹{consultation?.rate || 25}/min</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/70">Estimated Cost</p>
                <p className="font-semibold text-white">₹{Math.ceil((duration / 60) * (consultation?.rate || 25))}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-6">
          <Button
            size="icon"
            variant="ghost"
            className={`h-16 w-16 rounded-full ${isMuted ? "bg-white/20" : "bg-white/10"} text-white hover:bg-white/30`}
            onClick={handleToggleMute}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          <Button
            size="icon"
            className="h-20 w-20 rounded-full bg-destructive hover:bg-destructive/90"
            onClick={handleEndCall}
          >
            <Phone className="h-7 w-7 rotate-135" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className={`h-16 w-16 rounded-full ${isSpeakerOn ? "bg-white/20" : "bg-white/10"} text-white hover:bg-white/30`}
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          >
            {isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-white/60">Tap to mute • End call • Speaker</p>
      </div>
    </div>
  )
}
