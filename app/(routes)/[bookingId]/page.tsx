"use client"
import { useParams } from "next/navigation"
import type React from "react"

import { useState, useEffect } from "react"
import { AlertCircle} from "lucide-react"
import { countries } from "@/lib/countries"
import { DPEXTimeline } from "@/components/dpex-timeline"


interface TrackingData {
  id: string
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
          <DPEXTimeline
            bookingData={trackingData}
            getCountryName={getCountryName}
            onNewSearch={() => {
              setTrackingData(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
