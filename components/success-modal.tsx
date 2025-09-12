"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Mail, Phone, Award as IdCard, Copy } from "lucide-react"
import { useState } from "react"

interface SuccessModalProps {
  open: boolean
  onClose: () => void
  memberData: MemberData | null
}

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

export function SuccessModal({ open, onClose, memberData }: SuccessModalProps) {
  const [copied, setCopied] = useState(false)

  if (!memberData) return null

  const copyMemberId = () => {
    navigator.clipboard.writeText(memberData.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[95vh] overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl md:text-2xl text-green-600 flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8" />
            Registration Successful!
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-4 sm:space-y-6">
          <div className="text-4xl sm:text-6xl">🎉</div>

          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2">
              Welcome to St. Gabriel Chaplaincy!
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Your registration has been completed successfully and payment confirmed.
            </p>
          </div>

          {/* Member ID Card */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-base sm:text-lg md:text-xl font-bold mb-2">Your Member ID</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-mono font-bold mb-3">{memberData.id}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyMemberId}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs sm:text-sm"
              >
                <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {copied ? "Copied!" : "Copy ID"}
              </Button>
              <div className="text-xs sm:text-sm opacity-90 mt-2">Keep this ID for your records</div>
            </CardContent>
          </Card>

          {/* Registration Summary */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h4 className="font-semibold mb-3 text-sm sm:text-base">📋 Registration Summary</h4>
              <div className="space-y-2 text-xs sm:text-sm text-left">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium break-words">{memberData.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium break-all">{memberData.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{memberData.phone}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-gray-600">Ministry:</span>
                  <span className="font-medium">{memberData.ministry}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{memberData.paymentMethod}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-gray-600">Payment Reference:</span>
                  <span className="font-medium font-mono text-xs break-all">{memberData.paymentReference}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4 sm:p-6">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                What Happens Next?
              </h4>
              <div className="space-y-3 text-xs sm:text-sm text-green-700">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Admin Notification Sent</div>
                    <div className="text-xs opacity-90">Church admin has been notified of your registration</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <IdCard className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium">ID Card Preparation</div>
                    <div className="text-xs opacity-90">Your membership ID card will be prepared for printing</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Collection Notice</div>
                    <div className="text-xs opacity-90">
                      You will be contacted when your ID card is ready (24-48 hours)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
            <CardContent className="p-4 sm:p-6">
              <h4 className="font-semibold text-amber-800 mb-2 text-sm sm:text-base">📞 Important Notice</h4>
              <p className="text-xs sm:text-sm text-amber-700">
                Please keep your Member ID <strong className="font-mono">{memberData.id}</strong> safe. You will need it
                when collecting your physical ID card from the church office.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4 sm:p-6">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">📞 Contact Information</h4>
              <div className="space-y-1 text-xs sm:text-sm text-blue-700">
                <p>
                  <strong>Church Office:</strong> +234 801 234 5678
                </p>
                <p>
                  <strong>Email:</strong> admin@stgabrielchaplaincy.org
                </p>
                <p>
                  <strong>Address:</strong> St. Gabriel Chaplaincy, University Road
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Blessing */}
          <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <p className="text-sm sm:text-base text-gray-700 italic">
              "May the grace of our Lord Jesus Christ be with you always."
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">🕊️ Welcome to the St. Gabriel Chaplaincy family!</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onClose}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 text-sm sm:text-base"
            >
              ✨ Complete Registration
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto bg-transparent text-sm sm:text-base"
            >
              Register Another Member
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
