"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Send, Paperclip, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { chatAPI, astrologerAPI } from "@/lib/client/api"

export default function AstrologerChatPage() {
  const router = useRouter()
  const params = useParams()
  const consultationId = params.id as string
  const [message, setMessage] = useState("")
  const [timer, setTimer] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [consultation, setConsultation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const data = await astrologerAPI.getConsultation(consultationId) as any
        setConsultation(data)
        setTimer(data.duration || 0)
      } catch (error) {
        console.error("Failed to fetch consultation:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConsultation()

    const interval = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [consultationId])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await chatAPI.getMessages(consultationId) as any
        setMessages(data.messages || data || [])
      } catch (error) {
        console.error("Failed to fetch messages:", error)
      }
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [consultationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSend = async () => {
    if (message.trim()) {
      try {
        await chatAPI.sendMessage(consultationId, { content: message })
        setMessage("")
      } catch (error) {
        console.error("Failed to send message:", error)
      }
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback className="bg-orange-200">PS</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-gray-900">{consultation?.userName || consultation?.user?.name || "User"}</h3>
            <p className="text-xs text-green-600">Active now</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-orange-600">{formatTime(timer)}</p>
          <p className="text-xs text-gray-600">₹{((timer / 60) * (consultation?.rate || 10)).toFixed(0)}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderId === consultation?.astrologerId ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  msg.senderId === consultation?.astrologerId ? "bg-orange-500 text-white" : "bg-white text-gray-900 shadow-md"
                }`}
              >
                <p className="text-sm">{msg.message || msg.text}</p>
                <p className={`mt-1 text-xs ${msg.senderId === consultation?.astrologerId ? "text-orange-100" : "text-gray-500"}`}>
                  {new Date(msg.createdAt || msg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Paperclip className="h-5 w-5 text-gray-600" />
          </Button>
          <Input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 rounded-full border-gray-300"
          />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Smile className="h-5 w-5 text-gray-600" />
          </Button>
          <Button onClick={handleSend} size="icon" className="rounded-full bg-orange-500 hover:bg-orange-600">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
