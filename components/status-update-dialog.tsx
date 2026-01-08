"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { STATUS_OPTIONS } from "@/lib/status-config"
import { Edit } from "lucide-react"
import { getStatusConfig } from "@/lib/status-config"

interface StatusUpdateDialogProps {
  bookingId: string
  currentStatus: string
  onStatusUpdated: () => void
  trigger?: React.ReactNode
}

export function StatusUpdateDialog({ bookingId, currentStatus, onStatusUpdated, trigger }: StatusUpdateDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [notes, setNotes] = useState("")
  const [useCustomTime, setUseCustomTime] = useState(false)
  const [customDateTime, setCustomDateTime] = useState(new Date().toISOString().slice(0, 16))
  const [isUpdating, setIsUpdating] = useState(false)

  const selectedConfig = getStatusConfig(selectedStatus)

  const handleUpdate = async () => {
    if (!selectedStatus) return

    setIsUpdating(true)
    try {
      const payload: { status: string; notes: string | null; createdBy: string; timestamp?: string } = {
        status: selectedStatus,
        notes: notes || null,
        createdBy: "Admin",
      }

      if (useCustomTime && customDateTime) {
        payload.timestamp = new Date(customDateTime).toISOString()
      }

      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        onStatusUpdated()
        setOpen(false)
        setNotes("")
        setUseCustomTime(false)
        setCustomDateTime(new Date().toISOString().slice(0, 16))
      } else {
        const error = await response.json()
        alert(`Failed to update status: ${error.error}`)
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Update Status
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Shipment Status</DialogTitle>
          <DialogDescription>Change the status of this booking and add optional notes</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-auto">
                <SelectValue>
                  <div className="flex items-center gap-2 py-1">
                    <selectedConfig.icon className="h-4 w-4" />
                    <Badge className={selectedConfig.color}>{selectedConfig.label}</Badge>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                      <div className="flex items-center gap-3 py-1">
                        <div className={`p-1.5 rounded-md ${option.color}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-sm">{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this status update..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useCustomTime"
                checked={useCustomTime}
                onChange={(e) => setUseCustomTime(e.target.checked)}
                className="h-4 w-4 rounded border border-input"
              />
              <Label htmlFor="useCustomTime" className="font-normal cursor-pointer">
                Set custom date and time
              </Label>
            </div>
            {useCustomTime && (
              <Input
                type="datetime-local"
                value={customDateTime}
                onChange={(e) => setCustomDateTime(e.target.value)}
                className="h-10"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isUpdating}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isUpdating || selectedStatus === currentStatus}>
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
