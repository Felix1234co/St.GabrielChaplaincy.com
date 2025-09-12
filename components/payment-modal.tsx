"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Building2, Smartphone, Upload, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react"

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (data: MemberData) => void
  formData: FormData | null
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

declare global {
  interface Window {
    FlutterwaveCheckout: any
  }
}

export function PaymentModal({ open, onClose, onSuccess, formData }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("flutterwave")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [flutterwaveLoaded, setFlutterwaveLoaded] = useState(false)

  useEffect(() => {
    // Load Flutterwave script
    const script = document.createElement("script")
    script.src = "https://checkout.flutterwave.com/v3.js"
    script.async = true
    script.onload = () => setFlutterwaveLoaded(true)
    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://checkout.flutterwave.com/v3.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  if (!formData) return null

  const generateMemberId = () => {
    const prefix = "SG"
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `${prefix}${timestamp}${random}`
  }

  const updateStats = () => {
    const today = new Date().toISOString().split("T")[0]
    const thisMonth = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}`
    const thisYear = new Date().getFullYear().toString()

    const stats = JSON.parse(localStorage.getItem("registrationStats") || '{"daily": {}, "monthly": {}, "yearly": {}}')

    stats.daily[today] = (stats.daily[today] || 0) + 1
    stats.monthly[thisMonth] = (stats.monthly[thisMonth] || 0) + 1
    stats.yearly[thisYear] = (stats.yearly[thisYear] || 0) + 1

    localStorage.setItem("registrationStats", JSON.stringify(stats))

    const memberCounter = Number.parseInt(localStorage.getItem("memberCounter") || "0") + 1
    localStorage.setItem("memberCounter", memberCounter.toString())
  }

  const handleFlutterwavePayment = async () => {
    if (!flutterwaveLoaded) {
      alert("Payment system is loading. Please try again in a moment.")
      return
    }

    setIsProcessing(true)

    try {
      const memberId = generateMemberId()
      const txRef = `SG-${memberId}-${Date.now()}`

      const paymentData = {
        public_key: "FLWPUBK-TEST-SANDBOXDEMOKEY-X", // Replace with your actual Flutterwave public key
        tx_ref: txRef,
        amount: 1000,
        currency: "NGN",
        payment_options: "card,mobilemoney,ussd,banktransfer",
        redirect_url: window.location.origin,
        customer: {
          email: formData.emailAddress,
          phone_number: formData.phoneNumber,
          name: formData.fullName,
        },
        customizations: {
          title: "St. Gabriel Chaplaincy",
          description: "Membership Registration Fee",
          logo: `${window.location.origin}/placeholder-logo.png`,
        },
        callback: (response: any) => {
          console.log("Flutterwave response:", response)

          if (response.status === "successful") {
            // Payment successful
            const memberData: MemberData = {
              id: memberId,
              name: formData.fullName,
              email: formData.emailAddress,
              phone: formData.phoneNumber,
              dob: formData.dateOfBirth,
              ministry: formData.ministry === "Other" ? formData.customMinistry : formData.ministry,
              status: formData.sacramentStatus,
              yearsInFaith: formData.yearsInFaith,
              paymentMethod: "Flutterwave",
              paymentReference: response.transaction_id || txRef,
            }

            updateStats()
            setIsProcessing(false)
            onSuccess(memberData)
          } else {
            // Payment failed or cancelled
            setIsProcessing(false)
            alert("Payment was not completed. Please try again.")
          }
        },
        onclose: () => {
          // Payment modal closed
          setIsProcessing(false)
        },
      }

      // Initialize Flutterwave payment
      window.FlutterwaveCheckout(paymentData)
    } catch (error) {
      console.error("Flutterwave payment error:", error)
      setIsProcessing(false)
      alert("Payment initialization failed. Please try again.")
    }
  }

  const handleBankTransferPayment = async () => {
    if (!paymentScreenshot) {
      alert("Please upload payment screenshot to proceed.")
      return
    }

    setIsProcessing(true)

    try {
      // Simulate bank transfer verification
      setTimeout(() => {
        const memberData: MemberData = {
          id: generateMemberId(),
          name: formData.fullName,
          email: formData.emailAddress,
          phone: formData.phoneNumber,
          dob: formData.dateOfBirth,
          ministry: formData.ministry === "Other" ? formData.customMinistry : formData.ministry,
          status: formData.sacramentStatus,
          yearsInFaith: formData.yearsInFaith,
          paymentMethod: "Bank Transfer",
          paymentReference: `BT-${Date.now()}`,
        }

        updateStats()
        setIsProcessing(false)
        onSuccess(memberData)
      }, 2000)
    } catch (error) {
      console.error("Payment verification failed:", error)
      setIsProcessing(false)
      alert("Payment verification failed. Please try again.")
    }
  }

  const handleUSSDPayment = async () => {
    setIsProcessing(true)

    try {
      // Simulate USSD payment
      setTimeout(() => {
        const memberData: MemberData = {
          id: generateMemberId(),
          name: formData.fullName,
          email: formData.emailAddress,
          phone: formData.phoneNumber,
          dob: formData.dateOfBirth,
          ministry: formData.ministry === "Other" ? formData.customMinistry : formData.ministry,
          status: formData.sacramentStatus,
          yearsInFaith: formData.yearsInFaith,
          paymentMethod: "USSD",
          paymentReference: `USSD-${Date.now()}`,
        }

        updateStats()
        setIsProcessing(false)
        onSuccess(memberData)
      }, 2500)
    } catch (error) {
      console.error("USSD payment failed:", error)
      setIsProcessing(false)
      alert("USSD payment failed. Please try again.")
    }
  }

  const handleFileChange = (file: File | null) => {
    setPaymentScreenshot(file)

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setScreenshotPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setScreenshotPreview(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl md:text-2xl font-bold">
            💳 Complete Payment
          </DialogTitle>
          <p className="text-center text-muted-foreground text-xs sm:text-sm md:text-base">
            Choose your preferred payment method to complete registration
          </p>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Registration Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <h3 className="font-semibold text-blue-800 mb-3 text-sm sm:text-base">📋 Registration Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="truncate">
                  <strong>Name:</strong> {formData.fullName}
                </div>
                <div className="truncate">
                  <strong>Email:</strong> {formData.emailAddress}
                </div>
                <div>
                  <strong>Phone:</strong> {formData.phoneNumber}
                </div>
                <div className="truncate">
                  <strong>Ministry:</strong>{" "}
                  {formData.ministry === "Other" ? formData.customMinistry : formData.ministry}
                </div>
                <div>
                  <strong>Status:</strong> {formData.sacramentStatus}
                </div>
                <div>
                  <strong>Years in Faith:</strong> {formData.yearsInFaith} years
                </div>
              </div>
              <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-white rounded-lg border-l-4 border-blue-500">
                <div className="text-base sm:text-lg font-bold text-blue-800">Registration Fee: ₦1,000</div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="flutterwave" className="text-xs sm:text-sm p-2 sm:p-3">
                <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Card/</span>Online
              </TabsTrigger>
              <TabsTrigger value="bank" className="text-xs sm:text-sm p-2 sm:p-3">
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Bank </span>Transfer
              </TabsTrigger>
              <TabsTrigger value="ussd" className="text-xs sm:text-sm p-2 sm:p-3">
                <Smartphone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                USSD
              </TabsTrigger>
            </TabsList>

            {/* Flutterwave Payment */}
            <TabsContent value="flutterwave" className="space-y-3 sm:space-y-4">
              <Card>
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    <h3 className="text-base sm:text-lg font-semibold">Pay with Card or Online Banking</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    Secure payment powered by Flutterwave. Pay with your debit card, credit card, or online banking.
                  </p>

                  {/* Flutterwave Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="bg-green-50 p-2 sm:p-3 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium text-xs sm:text-sm">Secure & Instant</span>
                      </div>
                      <p className="text-xs text-green-700 mt-1">Bank-level security</p>
                    </div>
                    <div className="bg-blue-50 p-2 sm:p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-800">
                        <ExternalLink className="h-4 w-4" />
                        <span className="font-medium text-xs sm:text-sm">Multiple Options</span>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">Card, Bank, USSD, Transfer</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleFlutterwavePayment}
                    disabled={isProcessing || !flutterwaveLoaded}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 text-sm sm:text-base"
                  >
                    {isProcessing
                      ? "Processing Payment..."
                      : !flutterwaveLoaded
                        ? "Loading Payment System..."
                        : "Pay ₦1,000 with Flutterwave"}
                  </Button>

                  {!flutterwaveLoaded && (
                    <p className="text-xs text-gray-500 text-center mt-2">Loading secure payment system...</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bank Transfer */}
            <TabsContent value="bank" className="space-y-3 sm:space-y-4">
              <Card>
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    <h3 className="text-base sm:text-lg font-semibold">Bank Transfer</h3>
                  </div>

                  <div className="bg-white p-3 sm:p-4 rounded-lg border-l-4 border-green-500 mb-3 sm:mb-4">
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">Transfer to:</h4>
                    <div className="space-y-1 text-xs sm:text-sm">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <strong>Bank Name:</strong>
                        <span className="sm:text-right">Fidelity Bank Nigeria</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <strong>Account Number:</strong>
                        <span className="sm:text-right font-mono">1234567890</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <strong>Account Name:</strong>
                        <span className="sm:text-right">St. Gabriel Chaplaincy</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <strong>Amount:</strong>
                        <span className="sm:text-right text-green-600 font-bold">₦1,000</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="paymentScreenshot" className="text-sm sm:text-base">
                      Upload Payment Screenshot *
                    </Label>
                    <div className="mt-2">
                      <label
                        htmlFor="paymentScreenshot"
                        className="flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed border-green-300 rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-3 pb-3 sm:pt-5 sm:pb-6">
                          <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 text-green-500" />
                          <p className="text-xs sm:text-sm text-green-600 text-center px-2">
                            {paymentScreenshot ? "✅ Screenshot uploaded!" : "📱 Upload payment receipt/screenshot"}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">📷 Tap to use camera or gallery</p>
                        </div>
                        <input
                          id="paymentScreenshot"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        />
                      </label>
                      {screenshotPreview && (
                        <div className="mt-3 sm:mt-4 text-center">
                          <img
                            src={screenshotPreview || "/placeholder.svg"}
                            alt="Payment screenshot"
                            className="max-w-32 max-h-32 sm:max-w-48 sm:max-h-48 rounded-lg border-2 border-green-300 mx-auto"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleBankTransferPayment}
                    disabled={isProcessing || !paymentScreenshot}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 text-sm sm:text-base"
                  >
                    {isProcessing ? "Verifying Payment..." : "Verify Payment"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* USSD Payment */}
            <TabsContent value="ussd" className="space-y-3 sm:space-y-4">
              <Card>
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    <h3 className="text-base sm:text-lg font-semibold">USSD Payment</h3>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold mb-2 text-purple-800 text-sm sm:text-base">Available USSD Codes:</h4>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between items-center">
                          <span>GTBank:</span>
                          <code className="bg-purple-100 px-2 py-1 rounded text-xs">*737*1000#</code>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Access Bank:</span>
                          <code className="bg-purple-100 px-2 py-1 rounded text-xs">*901*1000#</code>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>First Bank:</span>
                          <code className="bg-purple-100 px-2 py-1 rounded text-xs">*894*1000#</code>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>UBA:</span>
                          <code className="bg-purple-100 px-2 py-1 rounded text-xs">*919*1000#</code>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Zenith Bank:</span>
                          <code className="bg-purple-100 px-2 py-1 rounded text-xs">*966*1000#</code>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-3 sm:p-4 rounded-lg border border-amber-200">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-amber-800 text-sm sm:text-base">Instructions:</h4>
                          <ol className="text-xs sm:text-sm text-amber-700 mt-1 space-y-1 list-decimal list-inside">
                            <li>Dial the USSD code for your bank</li>
                            <li>Follow the prompts to complete payment</li>
                            <li>Click "Confirm Payment" below after successful transaction</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleUSSDPayment}
                      disabled={isProcessing}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 sm:py-3 text-sm sm:text-base"
                    >
                      {isProcessing ? "Confirming Payment..." : "Confirm USSD Payment"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Processing Indicator */}
          {isProcessing && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-blue-800 font-medium text-sm sm:text-base">Processing your payment...</p>
                <p className="text-xs sm:text-sm text-blue-600">Please do not close this window</p>
              </CardContent>
            </Card>
          )}

          {/* Security Notice */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Secure Payment</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Your payment information is encrypted and secure. We do not store your card details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
