"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Eye, Edit, Download, Filter, Package, Calendar, FileSpreadsheet } from "lucide-react"
import { countries } from "@/lib/countries"
import { downloadBookingPDF, type BookingData } from "@/lib/pdf-generator"
import { STATUS_OPTIONS, getStatusConfig } from "@/lib/status-config"
import { StatusTimeline } from "@/components/status-timeline"
import { StatusUpdateDialog } from "@/components/status-update-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Booking {
  id: string
  booking_number: string
  created_at: string
  shipper_company_name: string
  consignee_company_name: string
  shipper_city: string
  consignee_city: string
  shipper_country: string
  consignee_country: string
  payment_mode: string
  item_type: string
  pieces: number
  status: string
  amount?: number
  // Include all other fields for detail view
  shipper_contact_person: string
  shipper_address_line: string
  shipper_zip: string
  shipper_state: string
  shipper_phone: string
  shipper_email: string
  consignee_contact_person: string
  consignee_address_line: string
  consignee_zip: string
  consignee_state: string
  consignee_phone: string
  consignee_email: string
  reference_number?: string
  product_value?: number
  billing_weight_kg?: number
  billing_weight_gm?: number
  gross_weight?: number
  remarks?: string
  item_description: string
  length_cm?: number
  width_cm?: number
  height_cm?: number
  dimensional_weight?: number
  packages?: Array<{
    id: string
    billing_weight_kg: number
    billing_weight_gm: number
    gross_weight: number
    length_cm: number
    width_cm: number
    height_cm: number
    pieces: number
    dimensional_weight: number
    description?: string
  }>
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [selectedBookings, setSelectedBookings] = useState<string[]>([])
  const [bulkUpdating, setBulkUpdating] = useState(false)
  const [bulkUpdateDialogOpen, setBulkUpdateDialogOpen] = useState(false)
  const [bulkUpdateStatus, setBulkUpdateStatus] = useState("")
  const [bulkUpdateNotes, setBulkUpdateNotes] = useState("")

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchTerm, statusFilter])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.booking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.shipper_company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.consignee_company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.shipper_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.consignee_city.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    setUpdatingStatus(bookingId)
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) => (booking.id === bookingId ? { ...booking, status: newStatus } : booking)),
        )
      } else {
        const errorData = await response.text()
        alert(`Failed to update booking status: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error("Error updating booking status:", error)
      alert("Network error: Failed to update booking status. Please try again.")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleBulkStatusUpdate = async () => {
    if (selectedBookings.length === 0) {
      alert("Please select bookings to update")
      return
    }

    if (!bulkUpdateStatus) {
      alert("Please select a status")
      return
    }

    setBulkUpdating(true)
    try {
      const response = await fetch("/api/bookings/bulk-update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingIds: selectedBookings,
          status: bulkUpdateStatus,
          notes: bulkUpdateNotes || null,
          createdBy: "Admin",
        }),
      })

      if (response.ok) {
        const result = await response.json()

        // Update local state
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            selectedBookings.includes(booking.id) ? { ...booking, status: bulkUpdateStatus } : booking,
          ),
        )

        // Clear selection and close dialog
        setSelectedBookings([])
        setBulkUpdateDialogOpen(false)
        setBulkUpdateStatus("")
        setBulkUpdateNotes("")
        alert(result.message)
      } else {
        const errorData = await response.json()
        alert(`Failed to update bookings: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Bulk update error:", error)
      alert("Network error: Failed to update bookings. Please try again.")
    } finally {
      setBulkUpdating(false)
    }
  }

  const handleBookingSelect = (bookingId: string, checked: boolean) => {
    if (checked) {
      setSelectedBookings((prev) => [...prev, bookingId])
    } else {
      setSelectedBookings((prev) => prev.filter((id) => id !== bookingId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBookings(filteredBookings.map((booking) => booking.id))
    } else {
      setSelectedBookings([])
    }
  }

  const getStatusSelect = (booking: Booking) => {
    const currentConfig = getStatusConfig(booking.status)
    const IconComponent = currentConfig.icon

    return (
      <StatusUpdateDialog
        bookingId={booking.id}
        currentStatus={booking.status}
        onStatusUpdated={fetchBookings}
        trigger={
          <Button variant="outline" size="sm" className="h-auto py-1.5 px-3 hover:bg-accent bg-transparent">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded ${currentConfig.color}`}>
                <IconComponent className="h-3 w-3" />
              </div>
              <span className="text-xs font-medium">{currentConfig.label}</span>
            </div>
          </Button>
        }
      />
    )
  }

  const getStatusBadge = (status: string) => {
    const config = getStatusConfig(status)
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const handleDownloadPDF = (booking: Booking) => {
    const packages = booking.packages?.map((pkg) => ({
      billingWeightKg: pkg.billing_weight_kg,
      billingWeightGm: pkg.billing_weight_gm,
      grossWeight: pkg.gross_weight,
      lengthCm: pkg.length_cm,
      widthCm: pkg.width_cm,
      heightCm: pkg.height_cm,
      pieces: pkg.pieces,
      dimensionalWeight: pkg.dimensional_weight,
      description: pkg.description || "",
    }))

    const pdfData: BookingData = {
      bookingNumber: booking.booking_number,
      createdAt: booking.created_at,
      shipperCompanyName: booking.shipper_company_name,
      shipperContactPerson: booking.shipper_contact_person,
      shipperAddressLine: booking.shipper_address_line,
      shipperCity: booking.shipper_city,
      shipperZip: booking.shipper_zip,
      shipperState: booking.shipper_state,
      shipperCountry: countries.find((c) => c.code === booking.shipper_country)?.name || booking.shipper_country,
      shipperPhone: booking.shipper_phone,
      shipperEmail: booking.shipper_email,
      consigneeCompanyName: booking.consignee_company_name,
      consigneeContactPerson: booking.consignee_contact_person,
      consigneeAddressLine: booking.consignee_address_line,
      consigneeCity: booking.consignee_city,
      consigneeZip: booking.consignee_zip,
      consigneeState: booking.consignee_state,
      consigneeCountry: countries.find((c) => c.code === booking.consignee_country)?.name || booking.consignee_country,
      consigneePhone: booking.consignee_phone,
      consigneeEmail: booking.consignee_email,
      paymentMode: booking.payment_mode,
      amount: booking.amount?.toString() || "",
      referenceNumber: booking.reference_number || "",
      pieces: booking.pieces.toString(),
      productValue: booking.product_value?.toString() || "",
      billingWeightKg: booking.billing_weight_kg?.toString() || "",
      billingWeightGm: booking.billing_weight_gm?.toString() || "",
      grossWeight: booking.gross_weight?.toString() || "",
      itemType: booking.item_type,
      remarks: booking.remarks || "",
      itemDescription: booking.item_description,
      lengthCm: booking.length_cm?.toString() || "",
      widthCm: booking.width_cm?.toString() || "",
      heightCm: booking.height_cm?.toString() || "",
      dimensionalWeight: booking.dimensional_weight,
      packages: packages,
    }

    downloadBookingPDF(pdfData)
  }

  const handleExportToExcel = async () => {
    try {
      // Dynamically import xlsx to avoid SSR issues
      const XLSX = await import("xlsx")

      // Prepare data for Excel export
      const exportData = filteredBookings.map((booking) => ({
        "Booking Number": booking.booking_number,
        Date: new Date(booking.created_at).toLocaleDateString(),
        "Shipper Company": booking.shipper_company_name,
        "Shipper Contact": booking.shipper_contact_person,
        "Shipper City": booking.shipper_city,
        "Shipper Country": countries.find((c) => c.code === booking.shipper_country)?.name || booking.shipper_country,
        "Shipper Phone": booking.shipper_phone,
        "Shipper Email": booking.shipper_email,
        "Consignee Company": booking.consignee_company_name,
        "Consignee Contact": booking.consignee_contact_person,
        "Consignee City": booking.consignee_city,
        "Consignee Country":
          countries.find((c) => c.code === booking.consignee_country)?.name || booking.consignee_country,
        "Consignee Phone": booking.consignee_phone,
        "Consignee Email": booking.consignee_email,
        "Payment Mode": booking.payment_mode,
        Amount: booking.amount || "",
        "Reference Number": booking.reference_number || "",
        Pieces: booking.pieces,
        "Item Type": booking.item_type,
        "Item Description": booking.item_description,
        "Billing Weight (kg)": booking.billing_weight_kg || "",
        "Billing Weight (gm)": booking.billing_weight_gm || "",
        "Gross Weight": booking.gross_weight || "",
        "Dimensions (L×W×H cm)":
          booking.length_cm && booking.width_cm && booking.height_cm
            ? `${booking.length_cm}×${booking.width_cm}×${booking.height_cm}`
            : "",
        "Dimensional Weight": booking.dimensional_weight || "",
        Status: booking.status,
        Remarks: booking.remarks || "",
      }))

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Set column widths for better readability
      const colWidths = [
        { wch: 15 }, // Booking Number
        { wch: 12 }, // Date
        { wch: 20 }, // Shipper Company
        { wch: 18 }, // Shipper Contact
        { wch: 15 }, // Shipper City
        { wch: 15 }, // Shipper Country
        { wch: 15 }, // Shipper Phone
        { wch: 25 }, // Shipper Email
        { wch: 20 }, // Consignee Company
        { wch: 18 }, // Consignee Contact
        { wch: 15 }, // Consignee City
        { wch: 15 }, // Consignee Country
        { wch: 15 }, // Consignee Phone
        { wch: 25 }, // Consignee Email
        { wch: 12 }, // Payment Mode
        { wch: 10 }, // Amount
        { wch: 15 }, // Reference Number
        { wch: 8 }, // Pieces
        { wch: 12 }, // Item Type
        { wch: 30 }, // Item Description
        { wch: 12 }, // Billing Weight (kg)
        { wch: 12 }, // Billing Weight (gm)
        { wch: 12 }, // Gross Weight
        { wch: 18 }, // Dimensions
        { wch: 15 }, // Dimensional Weight
        { wch: 12 }, // Status
        { wch: 30 }, // Remarks
      ]
      ws["!cols"] = colWidths

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Bookings")

      // Generate filename with current date
      const today = new Date().toISOString().split("T")[0]
      const filename = `bookings-export-${today}.xlsx`

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
      const blob = new Blob([wbout], { type: "application/octet-stream" })

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert("Failed to export bookings to Excel. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex items-center justify-between space-y-5">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Bookings</h1>
          <p className="text-muted-foreground">Manage and track all your shipment bookings</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExportToExcel}
            disabled={filteredBookings.length === 0}
            className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel ({filteredBookings.length})
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <a href="/booking">
              <Package className="h-4 w-4 mr-2" />
              New Booking
            </a>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by booking number, company name, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem  value="all">All Status</SelectItem>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Section */}
      {selectedBookings.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedBookings.length} booking{selectedBookings.length > 1 ? "s" : ""} selected
                </span>
                <Button variant="outline" size="sm" onClick={() => setSelectedBookings([])}>
                  Clear Selection
                </Button>
              </div>
              <Dialog open={bulkUpdateDialogOpen} onOpenChange={setBulkUpdateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-600 hover:bg-orange-700">Update Status</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Bulk Update Status</DialogTitle>
                    <DialogDescription>
                      Update status for {selectedBookings.length} selected booking
                      {selectedBookings.length > 1 ? "s" : ""}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="bulk-status">New Status</Label>
                      <Select value={bulkUpdateStatus} onValueChange={setBulkUpdateStatus}>
                        <SelectTrigger id="bulk-status" className="h-auto">
                          <SelectValue placeholder="Select status">
                            {bulkUpdateStatus && (
                              <div className="flex items-center gap-2 py-1">
                                {(() => {
                                  const config = getStatusConfig(bulkUpdateStatus)
                                  const IconComponent = config.icon
                                  return (
                                    <>
                                      <IconComponent className="h-4 w-4" />
                                      <Badge className={config.color}>{config.label}</Badge>
                                    </>
                                  )
                                })()}
                              </div>
                            )}
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
                      <Label htmlFor="bulk-notes">Comments/Remarks (Optional)</Label>
                      <Textarea
                        id="bulk-notes"
                        value={bulkUpdateNotes}
                        onChange={(e) => setBulkUpdateNotes(e.target.value)}
                        placeholder="Add comments or remarks for this status update..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setBulkUpdateDialogOpen(false)
                        setBulkUpdateStatus("")
                        setBulkUpdateNotes("")
                      }}
                      disabled={bulkUpdating}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleBulkStatusUpdate} disabled={bulkUpdating || !bulkUpdateStatus}>
                      {bulkUpdating ? "Updating..." : "Update Status"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bookings Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Bookings ({filteredBookings.length})</CardTitle>
          <CardDescription>
            {isLoading ? "Loading bookings..." : `Showing ${filteredBookings.length} of ${bookings.length} bookings`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || statusFilter !== "all" ? "No bookings match your filters" : "No bookings found"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* Select All Checkbox */}
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead>Booking #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Shipper</TableHead>
                    <TableHead>Consignee</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      {/* Individual Booking Checkbox */}
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(booking.id)}
                          onChange={(e) => handleBookingSelect(booking.id, e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{booking.booking_number}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(booking.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-32 truncate" title={booking.shipper_company_name}>
                          {booking.shipper_company_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-32 truncate" title={booking.consignee_company_name}>
                          {booking.consignee_company_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {booking.shipper_city} → {booking.consignee_city}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {booking.item_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusSelect(booking)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Booking Details - {booking.booking_number}</DialogTitle>
                                <DialogDescription>
                                  Created on {new Date(booking.created_at).toLocaleDateString()}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedBooking && (
                                <div className="space-y-6">
                                  {/* Status Timeline */}
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg">Current Status</h3>
                                    <StatusUpdateDialog
                                      bookingId={selectedBooking.id}
                                      currentStatus={selectedBooking.status}
                                      onStatusUpdated={fetchBookings}
                                    />
                                  </div>
                                  <StatusTimeline
                                    bookingId={selectedBooking.id}
                                    currentStatus={selectedBooking.status}
                                  />

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Shipper Information */}
                                    <div className="space-y-4">
                                      <h3 className="font-semibold text-lg">Shipper Information</h3>
                                      <div className="space-y-2 text-sm">
                                        <div>
                                          <strong>Company:</strong> {selectedBooking.shipper_company_name}
                                        </div>
                                        <div>
                                          <strong>Contact:</strong> {selectedBooking.shipper_contact_person}
                                        </div>
                                        <div>
                                          <strong>Address:</strong> {selectedBooking.shipper_address_line}
                                        </div>
                                        <div>
                                          <strong>City:</strong> {selectedBooking.shipper_city},{" "}
                                          {selectedBooking.shipper_state} {selectedBooking.shipper_zip}
                                        </div>
                                        <div>
                                          <strong>Country:</strong>{" "}
                                          {countries.find((c) => c.code === selectedBooking.shipper_country)?.name}
                                        </div>
                                        <div>
                                          <strong>Phone:</strong> {selectedBooking.shipper_phone}
                                        </div>
                                        <div>
                                          <strong>Email:</strong> {selectedBooking.shipper_email}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Consignee Information */}
                                    <div className="space-y-4">
                                      <h3 className="font-semibold text-lg">Consignee Information</h3>
                                      <div className="space-y-2 text-sm">
                                        <div>
                                          <strong>Company:</strong> {selectedBooking.consignee_company_name}
                                        </div>
                                        <div>
                                          <strong>Contact:</strong> {selectedBooking.consignee_contact_person}
                                        </div>
                                        <div>
                                          <strong>Address:</strong> {selectedBooking.consignee_address_line}
                                        </div>
                                        <div>
                                          <strong>City:</strong> {selectedBooking.consignee_city},{" "}
                                          {selectedBooking.consignee_state} {selectedBooking.consignee_zip}
                                        </div>
                                        <div>
                                          <strong>Country:</strong>{" "}
                                          {countries.find((c) => c.code === selectedBooking.consignee_country)?.name}
                                        </div>
                                        <div>
                                          <strong>Phone:</strong> {selectedBooking.consignee_phone}
                                        </div>
                                        <div>
                                          <strong>Email:</strong> {selectedBooking.consignee_email}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Shipment Information */}
                                    <div className="md:col-span-2 space-y-4">
                                      <h3 className="font-semibold text-lg">Shipment Information</h3>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                          <strong>Payment Mode:</strong> {selectedBooking.payment_mode}
                                        </div>
                                        <div>
                                          <strong>Amount:</strong>{" "}
                                          {selectedBooking.amount ? `$${selectedBooking.amount}` : "N/A"}
                                        </div>
                                        <div>
                                          <strong>Reference:</strong> {selectedBooking.reference_number || "N/A"}
                                        </div>
                                        <div>
                                          <strong>Pieces:</strong> {selectedBooking.pieces}
                                        </div>
                                        <div>
                                          <strong>Item Type:</strong> {selectedBooking.item_type}
                                        </div>
                                        <div>
                                          <strong>Status:</strong> {getStatusBadge(selectedBooking.status)}
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <div>
                                          <strong>Description:</strong> {selectedBooking.item_description}
                                        </div>
                                        {selectedBooking.remarks && (
                                          <div>
                                            <strong>Remarks:</strong> {selectedBooking.remarks}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Packages Information */}
                                    {selectedBooking.packages && (
                                      <div className="md:col-span-2 space-y-4">
                                        <h3 className="font-semibold text-lg">Packages Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                          {selectedBooking.packages.map((pkg, index) => (
                                            <div key={pkg.id}>
                                              <strong>Package {index + 1}:</strong>
                                              <div>
                                                <strong>Billing Weight (kg):</strong> {pkg.billing_weight_kg}
                                              </div>
                                              <div>
                                                <strong>Billing Weight (gm):</strong> {pkg.billing_weight_gm}
                                              </div>
                                              <div>
                                                <strong>Gross Weight:</strong> {pkg.gross_weight}
                                              </div>
                                              <div>
                                                <strong>Dimensions (L×W×H cm):</strong>{" "}
                                                {`${pkg.length_cm}×${pkg.width_cm}×${pkg.height_cm}`}
                                              </div>
                                              <div>
                                                <strong>Pieces:</strong> {pkg.pieces}
                                              </div>
                                              <div>
                                                <strong>Dimensional Weight:</strong> {pkg.dimensional_weight}
                                              </div>
                                              {pkg.description && (
                                                <div>
                                                  <strong>Description:</strong> {pkg.description}
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" onClick={() => handleDownloadPDF(booking)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`/dashboard/bookings/edit/${booking.id}`}>
                              <Edit className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
