"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { StarsBackground } from "@/components/stars-background"
import { Switch } from "@/components/ui/switch"
import { astrologerAPI } from "@/lib/client/api"

export default function AvailabilityPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [availability, setAvailability] = useState({
    monday: { enabled: true, start: "09:00", end: "18:00" },
    tuesday: { enabled: true, start: "09:00", end: "18:00" },
    wednesday: { enabled: true, start: "09:00", end: "18:00" },
    thursday: { enabled: true, start: "09:00", end: "18:00" },
    friday: { enabled: true, start: "09:00", end: "18:00" },
    saturday: { enabled: false, start: "10:00", end: "16:00" },
    sunday: { enabled: false, start: "10:00", end: "16:00" },
  })

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true)
        const data = await astrologerAPI.getAvailability() as any
        if (data.schedule) {
          setAvailability(data.schedule)
        }
      } catch (error) {
        console.error("Failed to fetch availability:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAvailability()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      await astrologerAPI.updateAvailability({ schedule: availability })
      alert("Availability updated successfully!")
    } catch (error) {
      console.error("Failed to save availability:", error)
      alert("Failed to save availability")
    } finally {
      setSaving(false)
    }
  }

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ]

  const toggleDay = (day: string) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day as keyof typeof availability],
        enabled: !availability[day as keyof typeof availability].enabled,
      },
    })
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
            <h1 className="text-2xl font-extrabold text-gray-900">Manage Availability</h1>
            <p className="text-sm text-gray-600">Set your working hours</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <Button className="h-12 rounded-xl bg-green-500 font-bold hover:bg-green-600">Available Now</Button>
          <Button
            variant="outline"
            className="h-12 rounded-xl border-2 border-red-500 font-bold text-red-600 hover:bg-red-50 bg-transparent"
          >
            Take Break
          </Button>
        </div>

        {/* Weekly Schedule */}
        <GlassmorphicCard className="mb-6 p-4">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <h3 className="font-bold text-gray-900">Weekly Schedule</h3>
          </div>

          <div className="space-y-4">
            {days.map((day) => (
              <div key={day.key} className="rounded-lg bg-white/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-bold text-gray-900">{day.label}</span>
                  <Switch
                    checked={availability[day.key as keyof typeof availability].enabled}
                    onCheckedChange={() => toggleDay(day.key)}
                  />
                </div>

                {availability[day.key as keyof typeof availability].enabled && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="mb-1 block text-xs text-gray-600">Start Time</label>
                      <input
                        type="time"
                        value={availability[day.key as keyof typeof availability].start}
                        className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                        onChange={(e) =>
                          setAvailability({
                            ...availability,
                            [day.key]: { ...availability[day.key as keyof typeof availability], start: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block text-xs text-gray-600">End Time</label>
                      <input
                        type="time"
                        value={availability[day.key as keyof typeof availability].end}
                        className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                        onChange={(e) =>
                          setAvailability({
                            ...availability,
                            [day.key]: { ...availability[day.key as keyof typeof availability], end: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassmorphicCard>

        {/* Save Button */}
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="h-12 w-full rounded-xl bg-orange-500 font-bold hover:bg-orange-600"
        >
          {saving ? "Saving..." : "Save Availability"}
        </Button>
      </div>
    </div>
  )
}
