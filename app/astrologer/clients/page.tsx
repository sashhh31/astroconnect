"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, MessageSquare, Phone, Star, Home, Users, Wallet, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { StarsBackground } from "@/components/stars-background"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { astrologerAPI } from "@/lib/client/api"

export default function ClientsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const data = await astrologerAPI.getClients() as any
        setClients(data.clients || data || [])
      } catch (error) {
        console.error("Failed to fetch clients:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  const filteredClients = clients.filter((client) => 
    (client.name || client.userName || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <StarsBackground />

      <div className="relative z-10 p-6 pb-24">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full bg-white shadow-md">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Clients</h1>
            <p className="text-sm text-gray-600">{clients.length} total clients</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-xl border-0 bg-white pl-10 shadow-md"
            />
          </div>
        </div>

        {/* Clients List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        ) : filteredClients.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No clients found</p>
        ) : (
        <div className="space-y-4">
          {filteredClients.map((client) => (
            <GlassmorphicCard key={client.id} className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/generic-placeholder-icon.png?height=48&width=48`} />
                    <AvatarFallback className="bg-orange-200 text-orange-700">{client.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-gray-900">{client.name || client.userName || "User"}</h3>
                    <p className="text-xs text-gray-600">{client.phone || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-bold text-gray-900">{client.rating}</span>
                </div>
              </div>

              <div className="mb-3 grid grid-cols-3 gap-2 rounded-lg bg-white/50 p-3">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Consultations</p>
                  <p className="font-bold text-gray-900">{client.totalConsultations || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Total Spent</p>
                  <p className="font-bold text-green-600">₹{client.totalSpent || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Last Visit</p>
                  <p className="text-xs font-medium text-gray-900">{client.lastConsultation || "N/A"}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2 rounded-lg bg-orange-500 hover:bg-orange-600">
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2 rounded-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
              </div>
            </GlassmorphicCard>
          ))}
        </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="flex items-center justify-around p-4">
          <button 
            onClick={() => router.push("/astrologer/dashboard")}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors"
          >
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button 
            onClick={() => router.push("/astrologer/clients")}
            className="flex flex-col items-center gap-1 text-orange-600"
          >
            <Users className="h-6 w-6" />
            <span className="text-xs font-medium">Clients</span>
          </button>
          <button 
            onClick={() => router.push("/astrologer/wallet")}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors"
          >
            <Wallet className="h-6 w-6" />
            <span className="text-xs font-medium">Wallet</span>
          </button>
          <button 
            onClick={() => router.push("/astrologer/settings")}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors"
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}
