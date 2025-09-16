"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Package,
  MapPin,
  Calendar,
  Weight,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
  Scan,
} from "lucide-react"
import { countries } from "@/lib/countries"
import { BarcodeScanner } from "@/components/barcode-scanner"
import { toast } from "sonner"

interface TrackingData {
  booking_number: string
  status: string
  created_at: string
  updated_at: string
  shipper_company_name: string
  shipper_city: string
  shipper_state: string
  shipper_country: string
  consignee_company_name: string
  consignee_city: string
  consignee_state: string
  consignee_country: string
  pieces: number
  gross_weight: number
  item_type: string
  payment_mode: string
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
    description: "Your booking has been received and is being processed",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
    description: "Your booking has been confirmed and is ready for pickup",
  },
  in_transit: {
    label: "In Transit",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Truck,
    description: "Your package is on its way to the destination",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    description: "Your package has been successfully delivered",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertCircle,
    description: "This booking has been cancelled",
  },
}

export default function TrackingPage() {
  const [bookingNumber, setBookingNumber] = useState("")
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showScanner, setShowScanner] = useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!bookingNumber.trim()) {
      setError("Please enter a booking number")
      return
    }

    setIsLoading(true)
    setError("")
    setTrackingData(null)

    try {
      const response = await fetch("/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingNumber: bookingNumber.trim() }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to track booking")
      }

      setTrackingData(result.booking)
    } catch (error) {
      console.error("[v0] Error tracking booking:", error)
      setError(error instanceof Error ? error.message : "Failed to track booking")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBarcodeScan = (scannedCode: string) => {
    const cleanCode = scannedCode.replace(/^EX/, "")
    setBookingNumber(cleanCode)
    setShowScanner(false)
    toast.success("Barcode scanned successfully!")

    setTimeout(() => {
      const form = document.querySelector("form") as HTMLFormElement
      if (form) {
        form.requestSubmit()
      }
    }, 100)
  }

  const getCountryName = (countryCode: string) => {
    return countries.find((c) => c.code === countryCode)?.name || countryCode
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Search className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Track Your Shipment</h1>
          </div>
          <p className="text-slate-600 text-balance">
            Enter your booking number or scan the barcode from your invoice to check the current status of your
            shipment.
          </p>
        </div>

        {/* Barcode Scanner Modal */}
        {showScanner && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <BarcodeScanner onScan={handleBarcodeScan} onClose={() => setShowScanner(false)} />
          </div>
        )}

        {/* Search Form */}
        <Card className="border-slate-200 shadow-sm mb-8">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Package className="h-5 w-5 text-blue-600" />
              Track Shipment
            </CardTitle>
            <CardDescription>Enter your booking number or scan the barcode from your invoice</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleTrack} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bookingNumber">Booking Number *</Label>
                <div className="flex gap-2">
                  <Input
                    id="bookingNumber"
                    value={bookingNumber}
                    onChange={(e) => setBookingNumber(e.target.value)}
                    placeholder="Enter your booking number (e.g., BK-2024-001)"
                    required
                    className="border-slate-300 flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowScanner(true)}
                    className="px-3"
                    title="Scan Barcode"
                  >
                    <Scan className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                {isLoading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Track Shipment
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-200">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Package className="h-5 w-5 text-blue-600" />
                  Shipment Status
                </CardTitle>
                <CardDescription>Booking Number: {trackingData.booking_number}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  {(() => {
                    const config = statusConfig[trackingData.status as keyof typeof statusConfig]
                    const IconComponent = config.icon
                    return (
                      <>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-6 w-6 text-slate-600" />
                          <Badge className={`text-base px-4 py-2 ${config.color}`}>{config.label}</Badge>
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-600">{config.description}</p>
                        </div>
                      </>
                    )
                  })()}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Booked On</p>
                      <p className="font-medium">{formatDate(trackingData.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Last Updated</p>
                      <p className="font-medium">{formatDate(trackingData.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipment Details */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-200">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Shipment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* From */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      From
                    </h3>
                    <div className="pl-5 space-y-1">
                      <p className="font-medium">{trackingData.shipper_company_name}</p>
                      <p className="text-slate-600">
                        {trackingData.shipper_city}, {trackingData.shipper_state}
                      </p>
                      <p className="text-slate-600">{getCountryName(trackingData.shipper_country)}</p>
                    </div>
                  </div>

                  {/* To */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      To
                    </h3>
                    <div className="pl-5 space-y-1">
                      <p className="font-medium">{trackingData.consignee_company_name}</p>
                      <p className="text-slate-600">
                        {trackingData.consignee_city}, {trackingData.consignee_state}
                      </p>
                      <p className="text-slate-600">{getCountryName(trackingData.consignee_country)}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Package Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Pieces</p>
                      <p className="font-medium">{trackingData.pieces}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Weight</p>
                      <p className="font-medium">{trackingData.gross_weight} kg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Service Type</p>
                      <p className="font-medium">{trackingData.item_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Payment</p>
                      <p className="font-medium">{trackingData.payment_mode}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
