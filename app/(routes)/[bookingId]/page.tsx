"use client"
import { useParams } from "next/navigation"
import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "lucide-react"
import { countries } from "@/lib/countries"
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
  const params = useParams()
  const bookingParam = params?.bookingId as string // match your dynamic route filename

  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
   useEffect(() => {
    if (!bookingParam) {
      setError("No booking number found in URL")
      return
    }

    const fetchTrackingData = async () => {
      setIsLoading(true)
      setError("")
      try {
        const response = await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingNumber: bookingParam }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to track booking")
        }

        setTrackingData(result.booking)
      } catch (err) {
        console.error("[v0] Error tracking booking:", err)
        setError(err instanceof Error ? err.message : "Failed to track booking")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrackingData()
  }, [bookingParam])

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
      <div className="mx-auto container">
        {/* Header */}
        <div className="mb-8">
          <p className="text-2xl font-bold">
            Tracking result for booking number: <span className="text-[#0253A3]">{bookingParam ?? "N/A"}</span> 
          </p>
        </div>

        {isLoading && (
          <div className="text-center text-blue-700 font-medium mb-6">Loading tracking information...</div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

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
                      <p className="font-medium">{trackingData.shipper_company_name ?? "N/A"}</p>
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
                      <p className="font-medium">{trackingData.consignee_company_name ?? "N/A"}</p>
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
