"use client"

import { useState } from "react"
import { RegistrationForm } from "@/components/registration-form"
import { PaymentModal } from "@/components/payment-modal"
import { SuccessModal } from "@/components/success-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Church, Calendar, Shield, Star, Heart, Award } from "lucide-react"

interface MemberData {
  id: string
  name: string
  email: string
  phone: string
  dob: string
  ministry: string
  status: string
  yearsInFaith: string
  paymentMethod: string
  paymentReference: string
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

export default function Home() {
  const [currentStep, setCurrentStep] = useState<"form" | "payment" | "success">("form")
  const [formData, setFormData] = useState<FormData | null>(null)
  const [memberData, setMemberData] = useState<MemberData | null>(null)

  const handleFormSubmit = (data: FormData) => {
    setFormData(data)
    setCurrentStep("payment")
  }

  const handlePaymentSuccess = (data: MemberData) => {
    setMemberData(data)
    // Send notification to admin
    sendAdminNotification(data, formData)
    setCurrentStep("success")
  }

  const handleBackToForm = () => {
    setCurrentStep("form")
    setFormData(null)
    setMemberData(null)
  }

  const sendAdminNotification = async (memberData: MemberData, formData: FormData | null) => {
    // In a real application, this would send to your backend
    const adminData = {
      memberData,
      formData,
      timestamp: new Date().toISOString(),
      needsIdCard: true,
      status: "pending_id_generation",
    }

    // Store in localStorage for demo (in production, send to your backend)
    const existingNotifications = JSON.parse(localStorage.getItem("adminNotifications") || "[]")
    existingNotifications.push(adminData)
    localStorage.setItem("adminNotifications", JSON.stringify(existingNotifications))

    console.log("Admin notification sent:", adminData)
  }

  const getTotalMembers = () => {
    if (typeof window === "undefined") return 0
    return Number.parseInt(localStorage.getItem("memberCounter") || "0")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Church className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900">St. Gabriel Chaplaincy</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Member Registration Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden md:inline">Secure Registration</span>
                <span className="sm:hidden md:hidden">Secure</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8">
        {currentStep === "form" && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Welcome to Our Community
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
                Join St. Gabriel Chaplaincy and become part of our vibrant Catholic community. Complete your
                registration and payment to receive your official membership ID card.
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-xs sm:text-sm">Total Members</p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-bold">{getTotalMembers()}</p>
                    </div>
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-xs sm:text-sm">Secure Payment</p>
                      <p className="text-lg sm:text-xl md:text-xl font-bold">₦1,000</p>
                    </div>
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-xs sm:text-sm">ID Card Ready</p>
                      <p className="text-lg sm:text-xl md:text-xl font-bold">24-48hrs</p>
                    </div>
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registration Steps */}
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-amber-800 mb-3 sm:mb-4">Registration Process</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                      1
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-amber-800">Fill Registration Form</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                      2
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-amber-800">Complete Payment</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                      3
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-amber-800">Receive ID Card</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    <h4 className="font-semibold text-sm sm:text-base">Official Membership</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Get your official membership ID card with photo and church seal
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    <h4 className="font-semibold text-sm sm:text-base">Community Access</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Join ministries, attend events, and participate in parish activities
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500 sm:col-span-2 lg:col-span-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    <h4 className="font-semibold text-sm sm:text-base">Spiritual Growth</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Grow in faith through our programs, retreats, and spiritual guidance
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Registration Form */}
            <RegistrationForm onSubmit={handleFormSubmit} />
          </div>
        )}
      </main>

      {/* Modals */}
      <PaymentModal
        open={currentStep === "payment"}
        onClose={handleBackToForm}
        onSuccess={handlePaymentSuccess}
        formData={formData}
      />

      <SuccessModal open={currentStep === "success"} onClose={handleBackToForm} memberData={memberData} />

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-8 sm:mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <p className="text-gray-600 text-xs sm:text-sm md:text-base">
              © 2024 St. Gabriel Chaplaincy. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">Building a stronger Catholic community together</p>
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-gray-400">
              <span>📞 +234 801 234 5678</span>
              <span className="hidden sm:inline">|</span>
              <span>📧 admin@stgabrielchaplaincy.org</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
