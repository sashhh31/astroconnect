"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Send, Paperclip, MoreVertical, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { consultationsAPI, chatAPI } from "@/lib/client/api"

interface Message {
  id: string
  sender: "user" | "astrologer"
  text: string
  time: string
  createdAt?: string
}

interface Consultation {
  id: string
  astrologerId: string
  astrologerName: string
  astrologerAvatar?: string
  status: string
  type: string
  startTime: string
}

export default function ChatConsultationPage() {
  const router = useRouter()
  const params = useParams()
  const consultationId = params.id as string
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [duration, setDuration] = useState(0)
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch consultation details and messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const consultationData = await consultationsAPI.get(consultationId)
        setConsultation(consultationData)

        // Fetch chat messages
        const messagesData = await chatAPI.getMessages(consultationId)
        setMessages(messagesData.map((msg: any) => ({
          id: msg.id,
          sender: msg.senderId === consultationData.astrologerId ? "astrologer" : "user",
          text: msg.message,
          time: new Date(msg.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          createdAt: msg.createdAt
        })))

        // Calculate duration
        if (consultationData.startTime) {
          const start = new Date(consultationData.startTime).getTime()
          const now = Date.now()
          setDuration(Math.floor((now - start) / 1000))
        }
      } catch (error) {
        console.error("Failed to fetch consultation:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [consultationId])

  // Poll for new messages
  useEffect(() => {
    if (!consultation) return

    pollingRef.current = setInterval(async () => {
      try {
        const messagesData = await chatAPI.getMessages(consultationId)
        setMessages(messagesData.map((msg: any) => ({
          id: msg.id,
          sender: msg.senderId === consultation.astrologerId ? "astrologer" : "user",
          text: msg.message,
          time: new Date(msg.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          createdAt: msg.createdAt
        })))
      } catch (error) {
        console.error("Failed to poll messages:", error)
      }
    }, 3000) // Poll every 3 seconds

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [consultationId, consultation])

  // Duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSend = async () => {
    if (!inputMessage.trim() || sending) return

    try {
      setSending(true)
      const newMessage = {
        id: `temp-${Date.now()}`,
        sender: "user" as const,
        text: inputMessage,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      }

      // Optimistically add message
      setMessages([...messages, newMessage])
      const messageText = inputMessage
      setInputMessage("")

      // Send to backend
      await chatAPI.sendMessage(consultationId, messageText)
    } catch (error) {
      console.error("Failed to send message:", error)
      // Revert on error
      setInputMessage(inputMessage)
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <div className="border-b bg-card/95 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={consultation?.astrologerAvatar || "/indian-astrologer-male.jpg"} />
              <AvatarFallback>{consultation?.astrologerName?.substring(0, 2).toUpperCase() || "AS"}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-foreground">{consultation?.astrologerName || "Loading..."}</h2>
              <div className="flex items-center gap-1 text-xs text-green-500">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {consultation?.status === "active" ? "Online" : "Offline"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
              <Clock className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-primary">{formatDuration(duration)}</span>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {loading && (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground shadow-sm"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`mt-1 text-xs ${message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                  {message.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-card/95 p-4 backdrop-blur-lg">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="rounded-full" disabled={sending || !inputMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
