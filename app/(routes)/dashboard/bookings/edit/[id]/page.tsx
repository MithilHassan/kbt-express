"use client"

import type React from "react"
import { MultipleDimensionsForm } from "@/components/multiple-dimensions-form"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Calculator, Package, User, Building, ArrowLeft, Save } from "lucide-react"
import { countries } from "@/lib/countries"
import { STATUS_OPTIONS, getStatusColor, getStatusIcon } from "@/lib/status-config"

interface EditBookingFormData {
  // Shipper Information
  shipperCompanyName: string
  shipperContactPerson: string
  shipperAddressLine: string
  shipperCity: string
  shipperZip: string
  shipperState: string
  shipperCountry: string
  shipperPhone: string
  shipperEmail: string
  shipperRegistrationType: string
  shipperRegistrationNumber: string

  // Consignee Information
  consigneeCompanyName: string
  consigneeContactPerson: string
  consigneeAddressLine: string
  consigneeCity: string
  consigneeZip: string
  consigneeState: string
  consigneeCountry: string
  consigneePhone: string
  consigneeEmail: string
  consigneeRegistrationType: string
  consigneeRegistrationNumber: string

  // Shipment Information
  paymentMode: string
  amount: string
  referenceNumber: string
  pieces: string
  productValue: string
  billingWeightKg: string
  billingWeightGm: string
  grossWeight: string
  itemType: string
  remarks: string
  itemDescription: string
  status: string

  // Dimensions for weight calculation
  packages: Array<{
    lengthCm: string
    widthCm: string
    heightCm: string
    pieces: string
    description: string
    dimensionalWeight: number
  }>
}

export default function EditBookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState<EditBookingFormData>({
    shipperCompanyName: "",
    shipperContactPerson: "",
    shipperAddressLine: "",
    shipperCity: "",
    shipperZip: "",
    shipperState: "",
    shipperCountry: "",
    shipperPhone: "",
    shipperEmail: "",
    shipperRegistrationType: "None",
    shipperRegistrationNumber: "",
    consigneeCompanyName: "",
    consigneeContactPerson: "",
    consigneeAddressLine: "",
    consigneeCity: "",
    consigneeZip: "",
    consigneeState: "",
    consigneeCountry: "",
    consigneePhone: "",
    consigneeEmail: "",
    consigneeRegistrationType: "None",
    consigneeRegistrationNumber: "",
    paymentMode: "",
    amount: "",
    referenceNumber: "",
    pieces: "1",
    productValue: "",
    billingWeightKg: "",
    billingWeightGm: "",
    grossWeight: "",
    itemType: "",
    remarks: "",
    itemDescription: "",
    status: "pending",
    packages: [],
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingNumber, setBookingNumber] = useState("")

  useEffect(() => {
    fetchBooking()
  }, [params.id])

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        const booking = data.booking

        setFormData({
          shipperCompanyName: booking.shipper_company_name || "",
          shipperContactPerson: booking.shipper_contact_person || "",
          shipperAddressLine: booking.shipper_address_line || "",
          shipperCity: booking.shipper_city || "",
          shipperZip: booking.shipper_zip || "",
          shipperState: booking.shipper_state || "",
          shipperCountry: booking.shipper_country || "",
          shipperPhone: booking.shipper_phone || "",
          shipperEmail: booking.shipper_email || "",
          shipperRegistrationType: booking.shipper_registration_type || "None",
          shipperRegistrationNumber: booking.shipper_registration_number || "",
          consigneeCompanyName: booking.consignee_company_name || "",
          consigneeContactPerson: booking.consignee_contact_person || "",
          consigneeAddressLine: booking.consignee_address_line || "",
          consigneeCity: booking.consignee_city || "",
          consigneeZip: booking.consignee_zip || "",
          consigneeState: booking.consignee_state || "",
          consigneeCountry: booking.consignee_country || "",
          consigneePhone: booking.consignee_phone || "",
          consigneeEmail: booking.consignee_email || "",
          consigneeRegistrationType: booking.consignee_registration_type || "None",
          consigneeRegistrationNumber: booking.consignee_registration_number || "",
          paymentMode: booking.payment_mode || "",
          amount: booking.amount?.toString() || "",
          referenceNumber: booking.reference_number || "",
          pieces: booking.pieces?.toString() || "1",
          productValue: booking.product_value?.toString() || "",
          billingWeightKg: booking.billing_weight_kg?.toString() || "",
          billingWeightGm: booking.billing_weight_gm?.toString() || "",
          grossWeight: booking.gross_weight?.toString() || "",
          itemType: booking.item_type || "",
          remarks: booking.remarks || "",
          itemDescription: booking.item_description || "",
          status: booking.status || "pending",
          packages:
            booking.packages?.map((pkg: any) => ({
              lengthCm: pkg.length_cm?.toString() || "",
              widthCm: pkg.width_cm?.toString() || "",
              heightCm: pkg.height_cm?.toString() || "",
              pieces: pkg.pieces?.toString() || "1",
              description: pkg.description || "",
              dimensionalWeight: pkg.dimensional_weight || 0,
            })) || [],
        })
        setBookingNumber(booking.booking_number)
      } else {
        console.error("[v0] Failed to fetch booking")
        router.push("/dashboard/bookings")
      }
    } catch (error) {
      console.error("[v0] Error fetching booking:", error)
      router.push("/dashboard/bookings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof EditBookingFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("[v0] Submitting booking update")
      console.log("[v0] Packages count:", formData.packages.length)
      console.log("[v0] Packages data:", formData.packages)

      const response = await fetch(`/api/bookings/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to update booking")
      }

      console.log("[v0] Booking updated successfully:", result.booking)
      router.push("/dashboard/bookings")
    } catch (error) {
      console.error("[v0] Error updating booking:", error)
      alert(`Error updating booking: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center py-8 text-muted-foreground">Loading booking...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Edit Booking</h1>
              <p className="text-muted-foreground">Booking Number: {bookingNumber}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Status Update */}
          <Card className="border-border">
            <CardHeader className="bg-muted border-b border-border">
              <CardTitle className="text-card-foreground">Booking Status</CardTitle>
              <CardDescription>Update the current status of this booking</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status">
                      {formData.status && (
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full ${getStatusColor(formData.status)}`}
                          >
                            {getStatusIcon(formData.status)}
                          </div>
                          <span>{formData.status}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => {
                      const Icon = option.icon
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-3 py-1">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${option.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{option.label}</span>
                              <span className="text-xs text-muted-foreground">{option.description}</span>
                            </div>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Shipper Information */}
          <Card className="border-border">
            <CardHeader className="bg-muted border-b border-border">
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Building className="h-5 w-5 text-primary" />
                Shipper Information
              </CardTitle>
              <CardDescription>Details of the sender</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shipperCompanyName">Company Name *</Label>
                  <Input
                    id="shipperCompanyName"
                    value={formData.shipperCompanyName}
                    onChange={(e) => handleInputChange("shipperCompanyName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipperContactPerson">Contact Person *</Label>
                  <Input
                    id="shipperContactPerson"
                    value={formData.shipperContactPerson}
                    onChange={(e) => handleInputChange("shipperContactPerson", e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="shipperAddressLine">Address Line *</Label>
                  <Input
                    id="shipperAddressLine"
                    value={formData.shipperAddressLine}
                    onChange={(e) => handleInputChange("shipperAddressLine", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipperCity">City *</Label>
                  <Input
                    id="shipperCity"
                    value={formData.shipperCity}
                    onChange={(e) => handleInputChange("shipperCity", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipperZip">ZIP Code *</Label>
                  <Input
                    id="shipperZip"
                    value={formData.shipperZip}
                    onChange={(e) => handleInputChange("shipperZip", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipperState">State *</Label>
                  <Input
                    id="shipperState"
                    value={formData.shipperState}
                    onChange={(e) => handleInputChange("shipperState", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipperCountry">Country *</Label>
                  <Select
                    value={formData.shipperCountry}
                    onValueChange={(value) => handleInputChange("shipperCountry", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipperPhone">Phone *</Label>
                  <Input
                    id="shipperPhone"
                    type="tel"
                    value={formData.shipperPhone}
                    onChange={(e) => handleInputChange("shipperPhone", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipperEmail">Email *</Label>
                  <Input
                    id="shipperEmail"
                    type="email"
                    value={formData.shipperEmail}
                    onChange={(e) => handleInputChange("shipperEmail", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipperRegistrationType">Registration Type</Label>
                  <Select
                    value={formData.shipperRegistrationType}
                    onValueChange={(value) => handleInputChange("shipperRegistrationType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select registration type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="BIN">BIN</SelectItem>
                      <SelectItem value="EORI">EORI</SelectItem>
                      <SelectItem value="IOSS">IOSS</SelectItem>
                      <SelectItem value="GST">GST</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipperRegistrationNumber">Registration Number</Label>
                  <Input
                    id="shipperRegistrationNumber"
                    value={formData.shipperRegistrationNumber}
                    onChange={(e) => handleInputChange("shipperRegistrationNumber", e.target.value)}
                    placeholder="Enter registration number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consignee Information */}
          <Card className="border-border">
            <CardHeader className="bg-muted border-b border-border">
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <User className="h-5 w-5 text-primary" />
                Consignee Information
              </CardTitle>
              <CardDescription>Details of the recipient</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="consigneeCompanyName">Company Name *</Label>
                  <Input
                    id="consigneeCompanyName"
                    value={formData.consigneeCompanyName}
                    onChange={(e) => handleInputChange("consigneeCompanyName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consigneeContactPerson">Contact Person *</Label>
                  <Input
                    id="consigneeContactPerson"
                    value={formData.consigneeContactPerson}
                    onChange={(e) => handleInputChange("consigneeContactPerson", e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="consigneeAddressLine">Address Line *</Label>
                  <Input
                    id="consigneeAddressLine"
                    value={formData.consigneeAddressLine}
                    onChange={(e) => handleInputChange("consigneeAddressLine", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consigneeCity">City *</Label>
                  <Input
                    id="consigneeCity"
                    value={formData.consigneeCity}
                    onChange={(e) => handleInputChange("consigneeCity", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consigneeZip">ZIP Code *</Label>
                  <Input
                    id="consigneeZip"
                    value={formData.consigneeZip}
                    onChange={(e) => handleInputChange("consigneeZip", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consigneeState">State *</Label>
                  <Input
                    id="consigneeState"
                    value={formData.consigneeState}
                    onChange={(e) => handleInputChange("consigneeState", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consigneeCountry">Country *</Label>
                  <Select
                    value={formData.consigneeCountry}
                    onValueChange={(value) => handleInputChange("consigneeCountry", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consigneePhone">Phone *</Label>
                  <Input
                    id="consigneePhone"
                    type="tel"
                    value={formData.consigneePhone}
                    onChange={(e) => handleInputChange("consigneePhone", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consigneeEmail">Email *</Label>
                  <Input
                    id="consigneeEmail"
                    type="email"
                    value={formData.consigneeEmail}
                    onChange={(e) => handleInputChange("consigneeEmail", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consigneeRegistrationType">Registration Type</Label>
                  <Select
                    value={formData.consigneeRegistrationType}
                    onValueChange={(value) => handleInputChange("consigneeRegistrationType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select registration type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="BIN">BIN</SelectItem>
                      <SelectItem value="EORI">EORI</SelectItem>
                      <SelectItem value="IOSS">IOSS</SelectItem>
                      <SelectItem value="GST">GST</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consigneeRegistrationNumber">Registration Number</Label>
                  <Input
                    id="consigneeRegistrationNumber"
                    value={formData.consigneeRegistrationNumber}
                    onChange={(e) => handleInputChange("consigneeRegistrationNumber", e.target.value)}
                    placeholder="Enter registration number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipment Information */}
          <Card className="border-border">
            <CardHeader className="bg-muted border-b border-border">
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Package className="h-5 w-5 text-primary" />
                Shipment Information
              </CardTitle>
              <CardDescription>Package details and payment information</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="paymentMode">Payment Mode *</Label>
                  <Select
                    value={formData.paymentMode}
                    onValueChange={(value) => handleInputChange("paymentMode", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COD">Cash on Delivery (COD)</SelectItem>
                      <SelectItem value="Prepaid">Prepaid</SelectItem>
                      <SelectItem value="Credit">Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referenceNumber">Reference Number</Label>
                  <Input
                    id="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={(e) => handleInputChange("referenceNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pieces">Pieces *</Label>
                  <Input
                    id="pieces"
                    type="number"
                    min="1"
                    value={formData.pieces}
                    onChange={(e) => handleInputChange("pieces", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productValue">Product Value</Label>
                  <Input
                    id="productValue"
                    type="number"
                    step="0.01"
                    value={formData.productValue}
                    onChange={(e) => handleInputChange("productValue", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemType">Item Type *</Label>
                  <Select value={formData.itemType} onValueChange={(value) => handleInputChange("itemType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SPX">Non Documents</SelectItem>
                      <SelectItem value="Docs">Documents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Weight Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Weight Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="billingWeightKg">Billing Weight (kg)</Label>
                    <Input
                      id="billingWeightKg"
                      type="number"
                      step="0.001"
                      value={formData.billingWeightKg}
                      onChange={(e) => handleInputChange("billingWeightKg", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingWeightGm">Billing Weight (gm)</Label>
                    <Input
                      id="billingWeightGm"
                      type="number"
                      step="0.001"
                      value={formData.billingWeightGm}
                      onChange={(e) => handleInputChange("billingWeightGm", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grossWeight">Gross Weight (kg)</Label>
                    <Input
                      id="grossWeight"
                      type="number"
                      step="0.001"
                      value={formData.grossWeight}
                      onChange={(e) => handleInputChange("grossWeight", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Dimensional Weight Calculator */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Package Dimensions</h3>
                </div>
                <MultipleDimensionsForm
                  dimensions={formData.packages}
                  onDimensionsChange={(dimensions) => {
                    setFormData((prev) => ({ ...prev, packages: dimensions }))
                  }}
                />
              </div>

              <Separator className="my-6" />

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemDescription">Item Description *</Label>
                    <Textarea
                      id="itemDescription"
                      value={formData.itemDescription}
                      onChange={(e) => handleInputChange("itemDescription", e.target.value)}
                      required
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="remarks">Remarks</Label>
                    <Textarea
                      id="remarks"
                      value={formData.remarks}
                      onChange={(e) => handleInputChange("remarks", e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Updating..." : "Update Booking"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
