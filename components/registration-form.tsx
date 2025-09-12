"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, User, Calendar, Phone, Mail, Church, Camera } from "lucide-react"

interface RegistrationFormProps {
  onSubmit: (data: FormData) => void
}

interface FormData {
  fullName: string
  dateOfBirth: string
  phoneNumber: string
  emailAddress: string
  ministry: string
  customMinistry: string
  sacramentStatus: string
  yearsInFaith: string
  passport: File | null
  paymentScreenshot: File | null
}

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    emailAddress: "",
    ministry: "",
    customMinistry: "",
    sacramentStatus: "",
    yearsInFaith: "",
    passport: null,
    paymentScreenshot: null,
  })

  const [passportPreview, setPassportPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const ministries = [
    "Choir",
    "Ushering",
    "Lectors",
    "Altar Servers",
    "Youth Ministry",
    "Women's Guild",
    "Men's Fellowship",
    "Children's Ministry",
    "Prayer Group",
    "Evangelization",
    "Social Services",
    "Other",
  ]

  const sacramentStatuses = [
    "Baptized",
    "Confirmed",
    "First Communion",
    "Baptized & Confirmed",
    "All Sacraments Received",
    "Preparing for Sacraments",
  ]

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required"
    } else {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 16) {
        newErrors.dateOfBirth = "Must be at least 16 years old"
      }
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^[\d\s\-+$$$$]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number"
    }

    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address"
    }

    if (!formData.ministry) {
      newErrors.ministry = "Please select a ministry"
    }

    if (formData.ministry === "Other" && !formData.customMinistry.trim()) {
      newErrors.customMinistry = "Please specify your ministry"
    }

    if (!formData.sacramentStatus) {
      newErrors.sacramentStatus = "Please select your sacrament status"
    }

    if (!formData.yearsInFaith) {
      newErrors.yearsInFaith = "Please specify years in Catholic faith"
    }

    if (!formData.passport) {
      newErrors.passport = "Passport photograph is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileChange = (file: File | null, field: "passport" | "paymentScreenshot") => {
    setFormData((prev) => ({ ...prev, [field]: file }))

    if (field === "passport" && file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPassportPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate form processing
    setTimeout(() => {
      onSubmit(formData)
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center pb-4 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2 sm:gap-3">
          <Church className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          Member Registration Form
        </CardTitle>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Please fill in all required information to complete your registration
        </p>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-gray-200">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm sm:text-base font-medium">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className={`h-10 sm:h-12 text-sm sm:text-base ${errors.fullName ? "border-red-500" : ""}`}
                />
                {errors.fullName && <p className="text-red-500 text-xs sm:text-sm">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm sm:text-base font-medium">
                  Date of Birth *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className={`h-10 sm:h-12 pl-10 sm:pl-12 text-sm sm:text-base ${errors.dateOfBirth ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.dateOfBirth && <p className="text-red-500 text-xs sm:text-sm">{errors.dateOfBirth}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm sm:text-base font-medium">
                  Phone Number *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="e.g., +234 801 234 5678"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className={`h-10 sm:h-12 pl-10 sm:pl-12 text-sm sm:text-base ${errors.phoneNumber ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.phoneNumber && <p className="text-red-500 text-xs sm:text-sm">{errors.phoneNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailAddress" className="text-sm sm:text-base font-medium">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    id="emailAddress"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.emailAddress}
                    onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                    className={`h-10 sm:h-12 pl-10 sm:pl-12 text-sm sm:text-base ${errors.emailAddress ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.emailAddress && <p className="text-red-500 text-xs sm:text-sm">{errors.emailAddress}</p>}
              </div>
            </div>
          </div>

          {/* Church Information Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-gray-200">
              <Church className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Church Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="ministry" className="text-sm sm:text-base font-medium">
                  Preferred Ministry *
                </Label>
                <Select onValueChange={(value) => handleInputChange("ministry", value)}>
                  <SelectTrigger
                    className={`h-10 sm:h-12 text-sm sm:text-base ${errors.ministry ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select a ministry" />
                  </SelectTrigger>
                  <SelectContent>
                    {ministries.map((ministry) => (
                      <SelectItem key={ministry} value={ministry} className="text-sm sm:text-base">
                        {ministry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.ministry && <p className="text-red-500 text-xs sm:text-sm">{errors.ministry}</p>}
              </div>

              {formData.ministry === "Other" && (
                <div className="space-y-2">
                  <Label htmlFor="customMinistry" className="text-sm sm:text-base font-medium">
                    Specify Ministry *
                  </Label>
                  <Input
                    id="customMinistry"
                    type="text"
                    placeholder="Please specify your ministry"
                    value={formData.customMinistry}
                    onChange={(e) => handleInputChange("customMinistry", e.target.value)}
                    className={`h-10 sm:h-12 text-sm sm:text-base ${errors.customMinistry ? "border-red-500" : ""}`}
                  />
                  {errors.customMinistry && <p className="text-red-500 text-xs sm:text-sm">{errors.customMinistry}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="sacramentStatus" className="text-sm sm:text-base font-medium">
                  Sacrament Status *
                </Label>
                <Select onValueChange={(value) => handleInputChange("sacramentStatus", value)}>
                  <SelectTrigger
                    className={`h-10 sm:h-12 text-sm sm:text-base ${errors.sacramentStatus ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select your sacrament status" />
                  </SelectTrigger>
                  <SelectContent>
                    {sacramentStatuses.map((status) => (
                      <SelectItem key={status} value={status} className="text-sm sm:text-base">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sacramentStatus && <p className="text-red-500 text-xs sm:text-sm">{errors.sacramentStatus}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsInFaith" className="text-sm sm:text-base font-medium">
                  Years in Catholic Faith *
                </Label>
                <Select onValueChange={(value) => handleInputChange("yearsInFaith", value)}>
                  <SelectTrigger
                    className={`h-10 sm:h-12 text-sm sm:text-base ${errors.yearsInFaith ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select years in faith" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">Less than 1 year</SelectItem>
                    <SelectItem value="1-5">1-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="11-20">11-20 years</SelectItem>
                    <SelectItem value="21-30">21-30 years</SelectItem>
                    <SelectItem value="30+">More than 30 years</SelectItem>
                    <SelectItem value="lifetime">Lifetime Catholic</SelectItem>
                  </SelectContent>
                </Select>
                {errors.yearsInFaith && <p className="text-red-500 text-xs sm:text-sm">{errors.yearsInFaith}</p>}
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-gray-200">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Document Upload</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passport" className="text-sm sm:text-base font-medium">
                  Passport Photograph *
                </Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label
                    htmlFor="passport"
                    className={`flex flex-col items-center justify-center w-full sm:w-48 h-32 sm:h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${
                      errors.passport ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-3 pb-3 sm:pt-5 sm:pb-6">
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-gray-400" />
                      <p className="text-xs sm:text-sm text-gray-500 text-center px-2">
                        {formData.passport ? "✅ Photo uploaded!" : "📷 Upload passport photo"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5MB)</p>
                      <p className="text-xs text-blue-600 mt-1">📱 Tap to use camera or gallery</p>
                    </div>
                    <input
                      id="passport"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handleFileChange(e.target.files?.[0] || null, "passport")}
                    />
                  </label>

                  {passportPreview && (
                    <div className="flex justify-center sm:justify-start">
                      <img
                        src={passportPreview || "/placeholder.svg"}
                        alt="Passport preview"
                        className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg border-2 border-gray-300"
                      />
                    </div>
                  )}
                </div>
                {errors.passport && <p className="text-red-500 text-xs sm:text-sm">{errors.passport}</p>}
                <p className="text-xs sm:text-sm text-gray-500">
                  Please upload a clear passport-style photograph for your ID card. On mobile, you can take a photo
                  directly or choose from gallery.
                </p>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4 sm:p-6">
              <h4 className="font-semibold text-blue-800 mb-3 text-sm sm:text-base">📋 Registration Terms</h4>
              <div className="space-y-2 text-xs sm:text-sm text-blue-700">
                <p>✅ I confirm that all information provided is accurate and truthful</p>
                <p>✅ I agree to participate actively in the selected ministry</p>
                <p>✅ I understand that a registration fee of ₦1,000 is required</p>
                <p>✅ I consent to my information being used for church administrative purposes</p>
                <p>✅ I will collect my ID card from the church office when notified</p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto px-6 py-2 sm:py-3 text-sm sm:text-base bg-transparent"
              onClick={() => window.location.reload()}
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 sm:py-3 text-sm sm:text-base font-semibold"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                "Proceed to Payment →"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
