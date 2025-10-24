"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { walletAPI } from "@/lib/client/api"
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Gift, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { BottomNav } from "@/components/bottom-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Moved to state - will be fetched from API

export default function WalletPage() {
  const router = useRouter()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const [balanceData, transactionsData] = await Promise.all([
          walletAPI.getBalance(),
          walletAPI.getTransactions(1, 10)
        ])
        setBalance(balanceData.balance || 0)
        setTransactions(transactionsData.transactions || [])
      } catch (error) {
        console.error('Failed to fetch wallet data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchWalletData()
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-24">
      <div className="px-4 py-6">
        {/* Wallet Balance Card */}
        <GlassmorphicCard gradient className="mb-6 overflow-hidden p-0">
          <div className="relative bg-gradient-to-br from-primary via-secondary to-accent p-6">
            <div className="absolute right-4 top-4">
              <Wallet className="h-16 w-16 text-white/20" />
            </div>
            <div className="relative z-10">
              <p className="mb-1 text-sm text-white/80">Available Balance</p>
              <h1 className="mb-4 text-4xl font-bold text-white">₹{balance}</h1>
              <Button
                size="lg"
                className="gap-2 bg-white text-primary hover:bg-white/90"
                onClick={() => router.push("/wallet/recharge")}
              >
                <Plus className="h-5 w-5" />
                Add Money
              </Button>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Quick Actions */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <GlassmorphicCard
            className="cursor-pointer p-4 transition-all hover:shadow-xl"
            onClick={() => router.push("/wallet/offers")}
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20">
              <Gift className="h-5 w-5 text-secondary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground">Offers</h3>
            <p className="text-xs text-muted-foreground">View all offers</p>
          </GlassmorphicCard>

          <GlassmorphicCard
            className="cursor-pointer p-4 transition-all hover:shadow-xl"
            onClick={() => router.push("/wallet/history")}
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
              <Clock className="h-5 w-5 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground">History</h3>
            <p className="text-xs text-muted-foreground">Transaction history</p>
          </GlassmorphicCard>
        </div>

        {/* Transactions */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Recent Transactions</h2>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="credit">Credit</TabsTrigger>
              <TabsTrigger value="debit">Debit</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No transactions yet</div>
              ) : transactions.map((transaction) => (
                <GlassmorphicCard key={transaction.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        transaction.type === "credit" ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{transaction.description}</h3>
                      <p className="text-xs text-muted-foreground">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}₹{parseFloat(transaction.amount).toFixed(0)}
                      </p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </GlassmorphicCard>
              ))}
            </TabsContent>

            <TabsContent value="credit" className="space-y-3">
              {transactions
                .filter((t) => t.type === "credit")
                .map((transaction) => (
                  <GlassmorphicCard key={transaction.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                        <ArrowDownLeft className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{transaction.description}</h3>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                      <p className="font-semibold text-green-600">+₹{transaction.amount}</p>
                    </div>
                  </GlassmorphicCard>
                ))}
            </TabsContent>

            <TabsContent value="debit" className="space-y-3">
              {transactions
                .filter((t) => t.type === "debit")
                .map((transaction) => (
                  <GlassmorphicCard key={transaction.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{transaction.description}</h3>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                      <p className="font-semibold text-red-600">-₹{transaction.amount}</p>
                    </div>
                  </GlassmorphicCard>
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
