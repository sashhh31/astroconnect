"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { StarsBackground } from "@/components/stars-background"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { astrologerAPI } from "@/lib/client/api"

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "Dr. Rajesh Sharma",
    email: "rajesh@example.com",
    phone: "+91 98765 43210",
    specialty: "Vedic Astrology",
    experience: "10",
    languages: "Hindi, English, Marathi",
    about: "Experienced Vedic astrologer with over 10 years of practice...",
    chatPrice: "10",
    callPrice: "15",
    videoPrice: "20",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await astrologerAPI.getProfile() as any
        setFormData({
          name: data.name || data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          specialty: data.specialization || data.specialty || "",
          experience: data.experience || "0",
          languages: Array.isArray(data.languages) ? data.languages.join(", ") : data.languages || "",
          about: data.bio || data.about || "",
          chatPrice: data.pricing?.chat || data.chatRate || "10",
          callPrice: data.pricing?.call || data.callRate || "15",
          videoPrice: data.pricing?.video || data.videoRate || "20",
        })
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await astrologerAPI.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialization: formData.specialty,
        experience: formData.experience,
        languages: formData.languages.split(",").map(l => l.trim()),
        bio: formData.about,
      })
      
      await astrologerAPI.updatePricing({
        chat: Number(formData.chatPrice),
        call: Number(formData.callPrice),
        video: Number(formData.videoPrice),
      })
      
      alert("Profile updated successfully!")
      router.back()
    } catch (error) {
      console.error("Failed to save profile:", error)
      alert("Failed to save profile")
    } finally {
      setSaving(false)
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
            <h1 className="text-2xl font-extrabold text-gray-900">Edit Profile</h1>
            <p className="text-sm text-gray-600">Update your information</p>
          </div>
        </div>

        {/* Profile Photo */}
        <GlassmorphicCard className="mb-6 p-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full">
                <Image src="/indian-astrologer-male.jpg" alt="Profile" fill className="object-cover" />
              </div>
              <button className="absolute bottom-0 right-0 rounded-full bg-orange-500 p-2 shadow-lg">
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>
            <p className="text-sm text-gray-600">Tap to change photo</p>
          </div>
        </GlassmorphicCard>

        {/* Basic Info */}
        <GlassmorphicCard className="mb-6 p-4">
          <h3 className="mb-4 font-bold text-gray-900">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
              <Input name="name" value={formData.name} onChange={handleChange} className="bg-white" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} className="bg-white" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
              <Input name="phone" value={formData.phone} onChange={handleChange} className="bg-white" />
            </div>
          </div>
        </GlassmorphicCard>

        {/* Professional Info */}
        <GlassmorphicCard className="mb-6 p-4">
          <h3 className="mb-4 font-bold text-gray-900">Professional Details</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Specialty</label>
              <Input name="specialty" value={formData.specialty} onChange={handleChange} className="bg-white" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Experience (years)</label>
              <Input
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                className="bg-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Languages</label>
              <Input name="languages" value={formData.languages} onChange={handleChange} className="bg-white" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">About</label>
              <Textarea name="about" value={formData.about} onChange={handleChange} rows={4} className="bg-white" />
            </div>
          </div>
        </GlassmorphicCard>

        {/* Pricing */}
        <GlassmorphicCard className="mb-6 p-4">
          <h3 className="mb-4 font-bold text-gray-900">Consultation Pricing (₹/min)</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Chat</label>
              <Input
                name="chatPrice"
                type="number"
                value={formData.chatPrice}
                onChange={handleChange}
                className="bg-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Call</label>
              <Input
                name="callPrice"
                type="number"
                value={formData.callPrice}
                onChange={handleChange}
                className="bg-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Video</label>
              <Input
                name="videoPrice"
                type="number"
                value={formData.videoPrice}
                onChange={handleChange}
                className="bg-white"
              />
            </div>
          </div>
        </GlassmorphicCard>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          disabled={saving || loading}
          className="h-12 w-full rounded-xl bg-orange-500 font-bold hover:bg-orange-600"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
