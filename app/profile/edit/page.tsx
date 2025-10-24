"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { userAPI } from "@/lib/client/api"
import { ArrowLeft, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassmorphicCard } from "@/components/glassmorphic-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EditProfilePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [dob, setDob] = useState("")
  const [gender, setGender] = useState("")
  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userAPI.getProfile()
        setName(data.fullName || '')
        setEmail(data.email || '')
        setPhone(data.phone?.replace('+91', '') || '')
        setDob(data.dateOfBirth || '')
        setGender(data.gender || '')
        setProfileImage(data.profileImageUrl || '')
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      await userAPI.updateProfile({
        fullName: name,
        email,
        phone: `+91${phone}`,
        dateOfBirth: dob,
        gender,
      })
      router.back()
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const result = await userAPI.uploadAvatar(file)
        setProfileImage(result.avatarUrl)
      } catch (error) {
        console.error('Failed to upload avatar:', error)
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-background to-background/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Edit Profile</h1>
          </div>
          <Button onClick={handleSave} size="sm" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="space-y-6 px-4 py-6">
        {/* Profile Picture */}
        <div className="flex justify-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileImage || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">{name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0">
              <Button size="icon" className="h-8 w-8 rounded-full" type="button" onClick={() => document.getElementById('avatar-upload')?.click()}>
                <Camera className="h-4 w-4" />
              </Button>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
        </div>

        {/* Form */}
        <GlassmorphicCard className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex gap-2">
              <div className="flex h-11 w-16 items-center justify-center rounded-lg border bg-card text-sm font-medium">
                +91
              </div>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  )
}
