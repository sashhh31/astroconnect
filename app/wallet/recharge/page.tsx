"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { walletAPI } from "@/lib/client/api"
import { ArrowLeft, CreditCard, Smartphone, Building2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { Badge } from "@/components/ui/badge"

const rechargeOptions = [
  { amount: 100, bonus: 0 },
  { amount: 250, bonus: 25 },
  { amount: 500, bonus: 50 },
  { amount: 1000, bonus: 150 },
  { amount: 2000, bonus: 400 },
  { amount: 5000, bonus: 1000 },
]

const paymentMethods = [
  { id: "upi", name: "UPI", icon: Smartphone, description: "Google Pay, PhonePe, Paytm" },
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, description: "Visa, Mastercard, Rupay" },
  { id: "netbanking", name: "Net Banking", icon: Building2, description: "All major banks" },
]

export default function RechargePage() {
  const router = useRouter()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const finalAmount = selectedAmount || Number.parseInt(customAmount) || 0
  const bonus = rechargeOptions.find((opt) => opt.amount === finalAmount)?.bonus || 0

  const handleProceed = async () => {
    if (finalAmount > 0 && selectedPayment) {
      setLoading(true)
      setError("")
      try {
        await walletAPI.recharge({
          amount: finalAmount,
          paymentMethod: selectedPayment
        })
        router.push("/wallet/payment-success")
      } catch (err: any) {
        setError(err.message || "Payment failed")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-background to-background/80 backdrop-blur-lg">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Recharge Wallet</h1>
            <p className="text-sm text-muted-foreground">Add money to your wallet</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-4 py-6">
        {/* Recharge Options */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Select Amount</h2>
          <div className="grid grid-cols-3 gap-3">
            {rechargeOptions.map((option) => (
              <GlassmorphicCard
                key={option.amount}
                className={`cursor-pointer p-4 text-center transition-all hover:shadow-xl ${
                  selectedAmount === option.amount ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => {
                  setSelectedAmount(option.amount)
                  setCustomAmount("")
                }}
              >
                <p className="mb-1 text-lg font-bold text-foreground">₹{option.amount}</p>
                {option.bonus > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    +₹{option.bonus} bonus
                  </Badge>
                )}
              </GlassmorphicCard>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <GlassmorphicCard className="p-4">
          <Label htmlFor="custom-amount" className="mb-2 block text-sm font-semibold">
            Or Enter Custom Amount
          </Label>
          <Input
            id="custom-amount"
            type="number"
            placeholder="Enter amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value)
              setSelectedAmount(null)
            }}
            min="100"
          />
          <p className="mt-2 text-xs text-muted-foreground">Minimum recharge amount is ₹100</p>
        </GlassmorphicCard>

        {/* Payment Summary */}
        {finalAmount > 0 && (
          <GlassmorphicCard className="p-4">
            <h3 className="mb-3 font-semibold text-foreground">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recharge Amount</span>
                <span className="font-medium text-foreground">₹{finalAmount}</span>
              </div>
              {bonus > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bonus</span>
                  <span className="font-medium text-green-600">+₹{bonus}</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total Amount</span>
                  <span className="text-lg font-bold text-primary">₹{finalAmount + bonus}</span>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        )}

        {/* Payment Methods */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Select Payment Method</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              return (
                <GlassmorphicCard
                  key={method.id}
                  className={`cursor-pointer p-4 transition-all hover:shadow-xl ${
                    selectedPayment === method.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{method.name}</h3>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                    {selectedPayment === method.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                </GlassmorphicCard>
              )
            })}
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {/* Proceed Button */}
        <Button onClick={handleProceed} disabled={finalAmount < 100 || !selectedPayment || loading} className="w-full" size="lg">
          {loading ? "Processing..." : `Proceed to Pay ₹${finalAmount}`}
        </Button>
      </div>
    </div>
  )
}
