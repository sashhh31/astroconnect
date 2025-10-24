"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MessageSquare, Phone, Video, Clock, User, Home, Users, Wallet, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { StarsBackground } from "@/components/stars-background"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { astrologerAPI } from "@/lib/client/api"

export default function ConsultationsPage() {
  const router = useRouter()
  const [activeConsultations, setActiveConsultations] = useState<any[]>([])
  const [pendingConsultations, setPendingConsultations] = useState<any[]>([])
  const [completedConsultations, setCompletedConsultations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true)
        const [active, pending, completed] = await Promise.all([
          astrologerAPI.getConsultations('active'),
          astrologerAPI.getPendingConsultations(),
          astrologerAPI.getConsultations('completed')
        ])
        
        setActiveConsultations((active as any)?.consultations || active || [])
        setPendingConsultations((pending as any)?.consultations || pending || [])
        setCompletedConsultations((completed as any)?.consultations || completed || [])
      } catch (error) {
        console.error("Failed to fetch consultations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConsultations()
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "chat":
        return <MessageSquare className="h-5 w-5" />
      case "call":
        return <Phone className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "chat":
        return "bg-orange-100 text-orange-600"
      case "call":
        return "bg-blue-100 text-blue-600"
      case "video":
        return "bg-purple-100 text-purple-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

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
            <h1 className="text-2xl font-extrabold text-gray-900">Consultations</h1>
            <p className="text-sm text-gray-600">Manage your sessions</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3 bg-white/80 p-1">
            <TabsTrigger value="active" className="rounded-lg font-bold">
              Active
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg font-bold">
              Pending
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg font-bold">
              Completed
            </TabsTrigger>
          </TabsList>

          {/* Active Consultations */}
          <TabsContent value="active" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
              </div>
            ) : activeConsultations.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No active consultations</p>
            ) : (
            activeConsultations.map((consultation: any) => (
              <GlassmorphicCard key={consultation.id} className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{consultation.userName || consultation.user?.name || "User"}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{consultation.duration || "Ongoing"}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`rounded-full p-2 ${getTypeColor(consultation.type)}`}>
                    {getTypeIcon(consultation.type)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-600">₹{consultation.amount || 0}</span>
                  <Button 
                    className="h-10 rounded-lg bg-green-500 px-6 font-bold text-white hover:bg-green-600"
                    onClick={() => router.push(`/astrologer/${consultation.type}/${consultation.id}`)}
                  >
                    Join Now
                  </Button>
                </div>
              </GlassmorphicCard>
            ))
            )}
          </TabsContent>

          {/* Pending Consultations */}
          <TabsContent value="pending" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
              </div>
            ) : pendingConsultations.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No pending consultations</p>
            ) : (
            pendingConsultations.map((consultation: any) => (
              <GlassmorphicCard key={consultation.id} className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{consultation.userName || consultation.user?.name || "User"}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Scheduled: {consultation.scheduledTime || consultation.startTime || "TBD"}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`rounded-full p-2 ${getTypeColor(consultation.type)}`}>
                    {getTypeIcon(consultation.type)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-600">₹{consultation.amount || 0}</span>
                  <Button
                    variant="outline"
                    className="h-10 rounded-lg border-2 border-orange-500 px-6 font-bold text-orange-600 hover:bg-orange-50 bg-transparent"
                    onClick={() => router.push(`/astrologer/consultations/${consultation.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </GlassmorphicCard>
            ))
            )}
          </TabsContent>

          {/* Completed Consultations */}
          <TabsContent value="completed" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
              </div>
            ) : completedConsultations.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No completed consultations</p>
            ) : (
            completedConsultations.map((consultation: any) => (
              <GlassmorphicCard key={consultation.id} className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{consultation.userName || consultation.user?.name || "User"}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{consultation.duration || "N/A"}</span>
                        <span>•</span>
                        <span>{consultation.completedAt || consultation.timeAgo || "Recently"}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`rounded-full p-2 ${getTypeColor(consultation.type)}`}>
                    {getTypeIcon(consultation.type)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-green-600">₹{consultation.amount || 0}</span>
                    <div className="mt-1 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < (consultation.rating || 0) ? "text-yellow-500" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="h-10 rounded-lg px-6 font-bold text-gray-600 hover:bg-gray-100"
                    onClick={() => router.push(`/astrologer/consultations/${consultation.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </GlassmorphicCard>
            ))
            )}
          </TabsContent>
        </Tabs>
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
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors"
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
