"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Award as IdCard, Bell, Download, Eye, Printer, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface AdminNotification {
  memberData: {
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
  formData: {
    fullName: string
    dateOfBirth: string
    phoneNumber: string
    emailAddress: string
    ministry: string
    customMinistry: string
    sacramentStatus: string
    yearsInFaith: string
    passport: string | null
    paymentScreenshot: string | null
  } | null
  timestamp: string
  needsIdCard: boolean
  status: string
}

export function AdminDashboard() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [selectedMember, setSelectedMember] = useState<AdminNotification | null>(null)
  const [showMemberDetails, setShowMemberDetails] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = () => {
    const savedNotifications = JSON.parse(localStorage.getItem("adminNotifications") || "[]")
    setNotifications(savedNotifications)
  }

  const markAsProcessed = (index: number) => {
    const updatedNotifications = [...notifications]
    updatedNotifications[index].status = "id_card_printed"
    setNotifications(updatedNotifications)
    localStorage.setItem("adminNotifications", JSON.stringify(updatedNotifications))
  }

  const exportMemberData = (member: AdminNotification) => {
    const exportData = {
      memberInfo: member.memberData,
      registrationDetails: member.formData,
      timestamp: member.timestamp,
      status: member.status,
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `member-${member.memberData.id}-data.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const printIdCard = (member: AdminNotification) => {
    // Create a printable ID card layout
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ID Card - ${member.memberData.name}</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: Arial, sans-serif;
              }
              .id-card { 
                width: 3.375in; 
                height: 2.125in; 
                border: 2px solid #000;
                border-radius: 8px;
                overflow: hidden;
                background: linear-gradient(135deg, #4F46E5, #7C3AED);
                color: white;
                position: relative;
                padding: 16px;
                box-sizing: border-box;
              }
              .header { text-align: center; margin-bottom: 12px; }
              .header h2 { margin: 0; font-size: 14px; }
              .header p { margin: 2px 0; font-size: 10px; opacity: 0.9; }
              .content { display: flex; gap: 12px; }
              .photo { 
                width: 60px; 
                height: 60px; 
                border: 2px solid white; 
                border-radius: 6px;
                background: rgba(255,255,255,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
              }
              .info { flex: 1; font-size: 10px; }
              .info div { margin-bottom: 4px; }
              .label { opacity: 0.8; text-transform: uppercase; font-size: 8px; }
              .value { font-weight: bold; }
              .footer { 
                position: absolute; 
                bottom: 8px; 
                right: 12px; 
                font-size: 8px; 
                opacity: 0.7; 
              }
              .member-id {
                position: absolute;
                top: 8px;
                right: 12px;
                background: rgba(255,255,255,0.2);
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 8px;
              }
              @media print {
                body { margin: 0; padding: 0; }
                .id-card { margin: 0; }
              }
            </style>
          </head>
          <body>
            <div class="id-card">
              <div class="member-id">${member.memberData.id}</div>
              <div class="header">
                <h2>St. Gabriel Chaplaincy</h2>
                <p>Member Identification Card</p>
              </div>
              <div class="content">
                <div class="photo">
                  ${member.formData?.passport ? `<img src="${member.formData.passport}" alt="Photo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;" />` : '👤'}
                </div>
                <div class="info">
                  <div>
                    <div class="label">Name</div>
                    <div class="value">${member.memberData.name}</div>
                  </div>
                  <div>
                    <div class="label">DOB</div>
                    <div class="value">${new Date(member.memberData.dob).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div class="label">Ministry</div>
                    <div class="value">${member.memberData.ministry}</div>
                  </div>
                  <div>
                    <div class="label">Status</div>
                    <div class="value">${member.memberData.status}</div>
                  </div>
                </div>
              </div>
              <div class="footer">
                Issued: ${new Date().toLocaleDateString()}
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.memberData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.memberData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.memberData.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || notification.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const pendingCount = notifications.filter((n) => n.status === "pending_id_generation").length
  const processedCount = notifications.filter((n) => n.status === "id_card_printed").length

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage member registrations and ID card printing</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Pending ID Cards</p>
                <p className="text-2xl sm:text-3xl font-bold">{pendingCount}</p>
              </div>
              <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm">Processed</p>
                <p className="text-2xl sm:text-3xl font-bold">{processedCount}</p>
              </div>
              <IdCard className="w-6 h-6 sm:w-8 sm:h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm">Total Members</p>
                <p className="text-2xl sm:text-3xl font-bold">{notifications.length}</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or member ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 sm:h-12"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                size="sm"
                className="text-xs sm:text-sm"
              >
                All
              </Button>
              <Button
                variant={filterStatus === "pending_id_generation" ? "default" : "outline"}
                onClick={() => setFilterStatus("pending_id_generation")}
                size="sm"
                className="text-xs sm:text-sm"
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === "id_card_printed" ? "default" : "outline"}
                onClick={() => setFilterStatus("id_card_printed")}
                size="sm"
                className="text-xs sm:text-sm"
              >
                Processed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Bell className="h-5 w-5" />
            Member Registration Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm || filterStatus !== "all"
                  ? "No members found matching your criteria"
                  : "No registrations yet"}
              </div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <Card
                  key={index}
                  className={`border-l-4 ${notification.status === "pending_id_generation" ? "border-l-orange-500" : "border-l-green-500"}`}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="font-semibold text-base sm:text-lg">{notification.memberData.name}</h3>
                          <Badge
                            variant="outline"
                            className={
                              notification.status === "pending_id_generation"
                                ? "text-orange-600 border-orange-600"
                                : "text-green-600 border-green-600"
                            }
                          >
                            {notification.status === "pending_id_generation" ? "Pending ID Card" : "ID Card Printed"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <div>
                            <span className="font-medium">ID:</span> {notification.memberData.id}
                          </div>
                          <div className="truncate">
                            <span className="font-medium">Email:</span> {notification.memberData.email}
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span> {notification.memberData.phone}
                          </div>
                          <div className="truncate">
                            <span className="font-medium">Ministry:</span> {notification.memberData.ministry}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Registered: {new Date(notification.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedMember(notification)
                            setShowMemberDetails(true)
                          }}
                          className="text-xs sm:text-sm"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => printIdCard(notification)}
                          className="text-xs sm:text-sm"
                        >
                          <Printer className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Print ID
                        </Button>
                        {notification.status === "pending_id_generation" && (
                          <Button
                            size="sm"
                            onClick={() => markAsProcessed(notifications.indexOf(notification))}
                            className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                          >
                            Mark Processed
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Member Details Modal */}
      <Dialog open={showMemberDetails} onOpenChange={setShowMemberDetails}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Member Details - {selectedMember?.memberData.name}</DialogTitle>
          </DialogHeader>

          {selectedMember && (
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Full Name:</span>
                      <div className="break-words">{selectedMember.memberData.name}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Member ID:</span>
                      <div className="font-mono">{selectedMember.memberData.id}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Date of Birth:</span>
                      <div>{new Date(selectedMember.memberData.dob).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Years in Faith:</span>
                      <div>{selectedMember.memberData.yearsInFaith} years</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Email:</span>
                      <div className="break-all">{selectedMember.memberData.email}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Phone:</span>
                      <div>{selectedMember.memberData.phone}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Ministry:</span>
                      <div className="break-words">{selectedMember.memberData.ministry}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Sacrament Status:</span>
                      <div>{selectedMember.memberData.status}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Payment Method:</span>
                      <div>{selectedMember.memberData.paymentMethod}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Payment Reference:</span>
                      <div className="font-mono text-xs break-all">{selectedMember.memberData.paymentReference}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => printIdCard(selectedMember)} className="flex-1">
                  <Printer className="h-4 w-4 mr-2" />
                  Print ID Card
                </Button>
                <Button variant="outline" onClick={() => exportMemberData(selectedMember)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
