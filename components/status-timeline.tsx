"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStatusConfig } from "@/lib/status-config"
import { Clock } from "lucide-react"

interface StatusHistoryEntry {
  id: string
  booking_id: string
  status: string
  timestamp: string
  notes?: string
  created_by?: string
}

interface StatusTimelineProps {
  bookingId: string
  currentStatus: string
}

export function StatusTimeline({ bookingId, currentStatus }: StatusTimelineProps) {
  const [history, setHistory] = useState<StatusHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStatusHistory()
  }, [bookingId])

  const fetchStatusHistory = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`)
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

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Timeline</CardTitle>
          <CardDescription>Loading status history...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Status Timeline
        </CardTitle>
        <CardDescription>Track the journey of your shipment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No status history available</p>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

              {/* Timeline entries */}
              <div className="space-y-6">
                {history.map((entry, index) => {
                  const config = getStatusConfig(entry.status)
                  const IconComponent = config.icon
                  const isLatest = index === history.length - 1

                  return (
                    <div key={entry.id} className="relative flex gap-4">
                      {/* Icon */}
                      <div
                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                          isLatest ? "bg-primary border-primary" : "bg-background border-border"
                        }`}
                      >
                        <IconComponent
                          className={`h-4 w-4 ${isLatest ? "text-primary-foreground" : "text-muted-foreground"}`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <Badge className={config.color}>{config.label}</Badge>
                            <p className="text-sm text-muted-foreground">{config.description}</p>
                            {entry.notes && <p className="text-sm italic text-muted-foreground">Note: {entry.notes}</p>}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatTimestamp(entry.timestamp)}</p>
                            {entry.created_by && <p className="text-xs text-muted-foreground">by {entry.created_by}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
