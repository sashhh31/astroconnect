"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp, ArrowDownToLine, CheckCircle, Home, Users, Wallet, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { StarsBackground } from "@/components/stars-background"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { astrologerAPI } from "@/lib/client/api"

export default function WalletPage() {
  const router = useRouter()
  const [balance, setBalance] = useState(0)
  const [monthlyEarnings, setMonthlyEarnings] = useState(0)
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [earnings, setEarnings] = useState<any[]>([])
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true)
        const [earningsData, summary, transactions] = await Promise.all([
          astrologerAPI.getEarnings(),
          astrologerAPI.getEarningsSummary(),
          astrologerAPI.getEarningsTransactions()
        ])
        
        const data = earningsData as any
        setBalance(data.availableBalance || data.balance || 0)
        
        const summaryData = summary as any
        setMonthlyEarnings(summaryData.monthlyEarnings || summaryData.thisMonth || 0)
        setTotalEarnings(summaryData.totalEarnings || summaryData.total || 0)
        
        const transData = transactions as any
        setEarnings(transData.earnings || transData.transactions || [])
        setWithdrawals(transData.withdrawals || [])
      } catch (error) {
        console.error("Failed to fetch wallet data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWalletData()
  }, [])

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
            <h1 className="text-2xl font-extrabold text-gray-900">Wallet</h1>
            <p className="text-sm text-gray-600">Manage your earnings</p>
          </div>
        </div>

        {/* Balance Card */}
        <GlassmorphicCard className="mb-6 bg-gradient-to-br from-orange-500 to-yellow-500 p-6 text-white">
          <p className="mb-2 text-sm font-medium opacity-90">Available Balance</p>
          <h2 className="mb-4 text-4xl font-extrabold">₹{balance.toLocaleString()}</h2>
          <Button className="h-12 w-full rounded-xl bg-white font-bold text-orange-600 hover:bg-gray-100">
            <ArrowDownToLine className="mr-2 h-5 w-5" />
            Withdraw Money
          </Button>
        </GlassmorphicCard>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <GlassmorphicCard className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-full bg-green-100 p-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">₹{monthlyEarnings.toLocaleString()}</p>
            <p className="text-sm text-gray-600">This Month</p>
          </GlassmorphicCard>

          <GlassmorphicCard className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-full bg-blue-100 p-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">₹{totalEarnings.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Earned</p>
          </GlassmorphicCard>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="earnings" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 bg-white/80 p-1">
            <TabsTrigger value="earnings" className="rounded-lg font-bold">
              Earnings
            </TabsTrigger>
            <TabsTrigger value="withdrawals" className="rounded-lg font-bold">
              Withdrawals
            </TabsTrigger>
          </TabsList>

          {/* Earnings */}
          <TabsContent value="earnings" className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
              </div>
            ) : earnings.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No earnings yet</p>
            ) : (
            earnings.map((earning: any) => (
              <GlassmorphicCard key={earning.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{earning.userName || earning.user?.name || "User"}</h3>
                    <p className="text-sm text-gray-600">
                      {earning.type || "Consultation"} • {earning.date || earning.createdAt || "Recent"}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-green-600">+₹{earning.amount || 0}</span>
                </div>
              </GlassmorphicCard>
            ))
            )}
          </TabsContent>

          {/* Withdrawals */}
          <TabsContent value="withdrawals" className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
              </div>
            ) : withdrawals.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No withdrawals yet</p>
            ) : (
            withdrawals.map((withdrawal: any) => (
              <GlassmorphicCard key={withdrawal.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">₹{withdrawal.amount || 0}</h3>
                    <p className="text-sm text-gray-600">
                      {withdrawal.account || "Bank Account"} • {withdrawal.date || withdrawal.createdAt || "Recent"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      withdrawal.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {withdrawal.status === "completed" ? "Completed" : "Pending"}
                  </span>
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
            className="flex flex-col items-center gap-1 text-orange-600"
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
