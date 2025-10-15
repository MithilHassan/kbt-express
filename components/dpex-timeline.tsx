"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getStatusConfig } from "@/lib/status-config"
import { Search } from "lucide-react"

interface StatusHistoryEntry {
  id: string
  booking_id: string
  status: string
  timestamp: string
  notes?: string
  location?: string
}

interface TrackingData {
  id: string
  booking_number: string
  status: string
  created_at: string
  shipper_country: string
  consignee_country: string
  item_type: string
}

interface DPEXTimelineProps {
  bookingData: TrackingData
  getCountryName: (code: string) => string
  onNewSearch: () => void
}

export function DPEXTimeline({ bookingData, getCountryName, onNewSearch }: DPEXTimelineProps) {
  const [history, setHistory] = useState<StatusHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const origin = ["Documentation Prepared", "Shipment Finalised", "Pickup Arranged", "Arrived Hub (Origin)"]
  const destination = ["Sorted to Destination", "In Transit to Destination","Arrived Depot (Destination)","Released from Customs", "Delivered",]
  useEffect(() => {
    fetchStatusHistory()
  }, [bookingData.id])

  const fetchStatusHistory = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingData.id}/status`)
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching status history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const currentStatusConfig = getStatusConfig(bookingData.status)

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div
        className={`${
          bookingData.status === "Delivered"
            ? "bg-gradient-to-r from-green-500 to-green-600"
            : bookingData.status === "Cancelled"
              ? "bg-gradient-to-r from-red-500 to-red-600"
              : "bg-gradient-to-r from-orange-500 to-orange-600"
        } text-white rounded-lg p-6 text-center shadow-lg`}
      >
        <h2 className="text-3xl font-bold">{currentStatusConfig.label}</h2>
      </div>

      {/* Booking Number */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <p className="text-2xl font-bold text-slate-900">{bookingData.booking_number}</p>
      </div>

      {/* Info Grid */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">Country:</p>
              <p className="font-semibold text-slate-900 uppercase">{getCountryName(bookingData.consignee_country)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Sender Ref:</p>
              <p className="font-semibold text-slate-900">NA</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Service Type:</p>
              <p className="font-semibold text-slate-900">{bookingData.item_type}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Alternate Ref:</p>
              <p className="font-semibold text-slate-900">NA</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      {isLoading ? (
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <p className="text-slate-500">Loading timeline...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-300 -translate-x-1/2" />

          {/* Timeline entries - reversed to show newest first */}
          <div className="space-y-8">
            {[...history].reverse().map((entry, index) => {
              const config = getStatusConfig(entry.status)
              const IconComponent = config.icon
              const isLeft = index % 2 === 0
              const isLatest = index === 0

              return (
                <div key={entry.id} className="relative">
                  {/* Center icon */}
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                        isLatest
                          ? "bg-gradient-to-br from-orange-400 to-orange-500"
                          : "bg-gradient-to-br from-orange-300 to-orange-400"
                      }`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content card - alternating sides */}
                  <div className={`flex ${isLeft ? "justify-start pr-[52%] text-right" : "justify-end pl-[52%]"}`}>
                    <Card className="border-slate-200 shadow-sm w-full">
                      <CardContent className="p-4">
                        <h3 className="font-bold text-slate-900 mb-1">{config.label}</h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {destination.includes(config.label)
                            ? getCountryName(bookingData.consignee_country)
                            : origin.includes(config.label)
                              ? getCountryName(bookingData.shipper_country)
                              : ""}
                        </p>
                        {entry.notes && (
                          <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-200">
                            <p className="text-xs text-slate-500 font-medium mb-1">Note:</p>
                            <p className="text-sm text-slate-700">{entry.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Date/Time on opposite side */}
                  <div className={`absolute top-1/2 ${isLeft ? "left-[55%] pr-4 text-left" : "right-[55%] pl-4 text-right"}`}>
                    <p className="text-sm font-medium text-slate-700">{formatDate(entry.timestamp)}</p>
                    <p className="text-sm text-slate-500">{formatTime(entry.timestamp)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
