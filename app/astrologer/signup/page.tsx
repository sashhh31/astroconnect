"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { AuthVideoBackground } from "@/components/auth-video-background"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { astrologerAPI } from "@/lib/client/api"

export default function AstrologerSignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step 1: Basic Info
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")

  // Step 2: Professional Details
  const [experience, setExperience] = useState("")
  const [specialization, setSpecialization] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [qualification, setQualification] = useState("")
  const [bio, setBio] = useState("")

  // Step 3: Pricing & Availability
  const [chatRate, setChatRate] = useState("")
  const [callRate, setCallRate] = useState("")
  const [videoRate, setVideoRate] = useState("")
  const [availability, setAvailability] = useState("")

  // Step 4: Bank Details
  const [accountName, setAccountName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [ifscCode, setIfscCode] = useState("")
  const [panNumber, setPanNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const totalSteps = 4

  const specializationOptions = [
    "Vedic Astrology",
    "Numerology",
    "Tarot Reading",
    "Palmistry",
    "Vastu",
    "KP Astrology",
    "Nadi Astrology",
    "Face Reading",
  ]

  const languageOptions = ["Hindi", "English", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati", "Kannada"]

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      try {
        setLoading(true)
        setError("")
        const response = await astrologerAPI.register({
          name,
          email,
          phone: `+91${phone}`,
          password,
          experience,
          specializations: specialization,
          languages,
          qualification,
          bio,
          pricing: {
            chat: Number(chatRate),
            call: Number(callRate),
            video: Number(videoRate)
          },
          availability,
          bankDetails: {
            accountName,
            accountNumber,
            ifscCode,
            panNumber
          }
        }) as any
        
        if (response.token || response.accessToken) {
          localStorage.setItem("accessToken", response.token || response.accessToken)
          localStorage.setItem("astrologer_logged_in", "true")
          router.push("/astrologer/dashboard")
        }
      } catch (err: any) {
        console.error("Registration error:", err)
        setError(err.message || "Registration failed. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.back()
    }
  }

  const toggleSpecialization = (spec: string) => {
    setSpecialization((prev) => (prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]))
  }

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) => (prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]))
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return name && email && phone.length === 10 && password.length >= 6
      case 2:
        return experience && specialization.length > 0 && languages.length > 0 && qualification && bio
      case 3:
        return chatRate && callRate && videoRate && availability
      case 4:
        return accountName && accountNumber && ifscCode && panNumber
      default:
        return false
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AuthVideoBackground />

      <div className="relative z-20 flex min-h-screen items-end justify-center pb-0">
        <div className="w-full">
          <div className="mb-6 flex items-center justify-between px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Button>
            <div className="relative h-20 w-20 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm">
              <Image src="/logo.png" alt="Anytime Pooja" fill className="object-contain p-2" priority />
            </div>
            <div className="w-10" />
          </div>

          <div className="max-h-[80vh] overflow-y-auto rounded-t-[2rem] bg-white/95 p-6 pb-8 shadow-2xl backdrop-blur-md">
            {/* Progress Steps */}
            <div className="mb-6 flex items-center justify-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
                      s < step
                        ? "bg-green-500 text-white"
                        : s === step
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {s < step ? <Check className="h-4 w-4" /> : s}
                  </div>
                  {s < 4 && <div className={`h-1 w-8 transition-all ${s < step ? "bg-green-500" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>

            <div className="mb-6 text-center">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                {step === 1 && "Basic Information"}
                {step === 2 && "Professional Details"}
                {step === 3 && "Pricing & Availability"}
                {step === 4 && "Bank Details"}
              </h1>
              <p className="text-sm text-gray-600">
                {step === 1 && "Create your astrologer account"}
                {step === 2 && "Tell us about your expertise"}
                {step === 3 && "Set your consultation rates"}
                {step === 4 && "Payment information"}
              </p>
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="h-12 border-gray-200 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium text-gray-700">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="h-12 border-gray-200 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex h-12 w-14 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-sm font-semibold">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10 digit number"
                      className="h-12 flex-1 border-gray-200 focus:border-orange-500"
                      maxLength={10}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-medium text-gray-700">
                    Password *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="h-12 border-gray-200 focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Professional Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="experience" className="font-medium text-gray-700">
                    Years of Experience *
                  </Label>
                  <Select value={experience} onValueChange={setExperience}>
                    <SelectTrigger className="h-12 border-gray-200">
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Specialization * (Select multiple)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {specializationOptions.map((spec) => (
                      <div key={spec} className="flex items-center space-x-2">
                        <Checkbox
                          id={spec}
                          checked={specialization.includes(spec)}
                          onCheckedChange={() => toggleSpecialization(spec)}
                        />
                        <label htmlFor={spec} className="text-sm text-gray-700">
                          {spec}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Languages * (Select multiple)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {languageOptions.map((lang) => (
                      <div key={lang} className="flex items-center space-x-2">
                        <Checkbox
                          id={lang}
                          checked={languages.includes(lang)}
                          onCheckedChange={() => toggleLanguage(lang)}
                        />
                        <label htmlFor={lang} className="text-sm text-gray-700">
                          {lang}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualification" className="font-medium text-gray-700">
                    Qualification *
                  </Label>
                  <Input
                    id="qualification"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g., Jyotish Acharya, PhD in Astrology"
                    className="h-12 border-gray-200 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="font-medium text-gray-700">
                    Bio *
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself and your expertise..."
                    className="min-h-24 border-gray-200 focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Pricing & Availability */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chatRate" className="font-medium text-gray-700">
                    Chat Rate (₹/min) *
                  </Label>
                  <Input
                    id="chatRate"
                    type="number"
                    value={chatRate}
                    onChange={(e) => setChatRate(e.target.value)}
                    placeholder="e.g., 10"
                    className="h-12 border-gray-200 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="callRate" className="font-medium text-gray-700">
                    Call Rate (₹/min) *
                  </Label>
                  <Input
                    id="callRate"
                    type="number"
                    value={callRate}
                    onChange={(e) => setCallRate(e.target.value)}
                    placeholder="e.g., 15"
                    className="h-12 border-gray-200 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoRate" className="font-medium text-gray-700">
                    Video Call Rate (₹/min) *
                  </Label>
                  <Input
                    id="videoRate"
                    type="number"
                    value={videoRate}
                    onChange={(e) => setVideoRate(e.target.value)}
                    placeholder="e.g., 20"
                    className="h-12 border-gray-200 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability" className="font-medium text-gray-700">
                    Availability *
                  </Label>
                  <Select value={availability} onValueChange={setAvailability}>
                    <SelectTrigger className="h-12 border-gray-200">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full Time (8+ hours/day)</SelectItem>
                      <SelectItem value="part-time">Part Time (4-8 hours/day)</SelectItem>
                      <SelectItem value="flexible">Flexible (As per schedule)</SelectItem>
                      <SelectItem value="weekends">Weekends Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 4: Bank Details */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName" className="font-medium text-gray-700">
                    Account Holder Name *
                  </Label>
                  <Input
                    id="accountName"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="As per bank records"
                    className="h-12 border-gray-200 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="font-medium text-gray-700">
                    Account Number *
                  </Label>
                  <Input
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Bank account number"
                    className="h-12 border-gray-200 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ifscCode" className="font-medium text-gray-700">
                    IFSC Code *
                  </Label>
                  <Input
                    id="ifscCode"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    placeholder="e.g., SBIN0001234"
                    className="h-12 border-gray-200 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panNumber" className="font-medium text-gray-700">
                    PAN Number *
                  </Label>
                  <Input
                    id="panNumber"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="e.g., ABCDE1234F"
                    className="h-12 border-gray-200 focus:border-orange-500"
                    maxLength={10}
                  />
                </div>

                <div className="rounded-lg bg-yellow-50 p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> Your bank details are securely stored and will be used only for payment
                    processing.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              onClick={handleNext}
              className="mt-6 h-12 w-full rounded-xl bg-orange-500 text-base font-bold text-white transition-colors hover:bg-orange-600"
              disabled={!isStepValid() || loading}
            >
              {step < totalSteps ? (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already registered?{" "}
                <button
                  onClick={() => router.push("/astrologer/login")}
                  className="font-bold text-orange-600 transition-colors hover:text-orange-700"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
