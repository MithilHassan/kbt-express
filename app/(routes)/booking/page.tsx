"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calculator, Package, Truck, User, Building, Download, CheckCircle } from "lucide-react"
import { countries } from "@/lib/countries"
import { downloadBookingPDF, type BookingData } from "@/lib/pdf-generator"

interface BookingFormData {
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

  // Dimensions for weight calculation
  lengthCm: string
  widthCm: string
  heightCm: string
  dimPieces: string
}

export default function BookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    shipperCompanyName: "",
    shipperContactPerson: "",
    shipperAddressLine: "",
    shipperCity: "",
    shipperZip: "",
    shipperState: "",
    shipperCountry: "",
    shipperPhone: "",
    shipperEmail: "",
    consigneeCompanyName: "",
    consigneeContactPerson: "",
    consigneeAddressLine: "",
    consigneeCity: "",
    consigneeZip: "",
    consigneeState: "",
    consigneeCountry: "",
    consigneePhone: "",
    consigneeEmail: "",
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
    lengthCm: "",
    widthCm: "",
    heightCm: "",
    dimPieces: "1",
  })

  const [dimensionalWeight, setDimensionalWeight] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [bookingData, setBookingData] = useState<BookingData | null>(null)

  useEffect(() => {
    const length = Number.parseFloat(formData.lengthCm) || 0
    const width = Number.parseFloat(formData.widthCm) || 0
    const height = Number.parseFloat(formData.heightCm) || 0
    const pieces = Number.parseFloat(formData.dimPieces) || 1

    if (length > 0 && width > 0 && height > 0) {
      const dimWeight = (length * width * height * pieces) / 5000
      setDimensionalWeight(dimWeight)
    } else {
      setDimensionalWeight(0)
    }
  }, [formData.lengthCm, formData.widthCm, formData.heightCm, formData.dimPieces])

  useEffect(() => {
    const billingKg = Number.parseFloat(formData.billingWeightKg) || 0
    const billingGm = Number.parseFloat(formData.billingWeightGm) || 0
    const totalBillingWeight = billingKg + billingGm / 1000 // Convert gm to kg

    // Gross weight is the higher of billing weight or dimensional weight
    const calculatedGrossWeight = Math.max(totalBillingWeight, dimensionalWeight)

    if (calculatedGrossWeight > 0) {
      setFormData((prev) => ({
        ...prev,
        grossWeight: calculatedGrossWeight.toFixed(3),
      }))
    }
  }, [formData.billingWeightKg, formData.billingWeightGm, dimensionalWeight])

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("[v0] Submitting form data:", formData)

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit booking")
      }

      console.log("[v0] Booking created successfully:", result.booking)

      const pdfData: BookingData = {
        bookingNumber: result.booking.booking_number,
        createdAt: result.booking.created_at,

        shipperCompanyName: formData.shipperCompanyName,
        shipperContactPerson: formData.shipperContactPerson,
        shipperAddressLine: formData.shipperAddressLine,
        shipperCity: formData.shipperCity,
        shipperZip: formData.shipperZip,
        shipperState: formData.shipperState,
        shipperCountry: countries.find((c) => c.code === formData.shipperCountry)?.name || formData.shipperCountry,
        shipperPhone: formData.shipperPhone,
        shipperEmail: formData.shipperEmail,

        consigneeCompanyName: formData.consigneeCompanyName,
        consigneeContactPerson: formData.consigneeContactPerson,
        consigneeAddressLine: formData.consigneeAddressLine,
        consigneeCity: formData.consigneeCity,
        consigneeZip: formData.consigneeZip,
        consigneeState: formData.consigneeState,
        consigneeCountry:
          countries.find((c) => c.code === formData.consigneeCountry)?.name || formData.consigneeCountry,
        consigneePhone: formData.consigneePhone,
        consigneeEmail: formData.consigneeEmail,

        paymentMode: formData.paymentMode,
        amount: formData.amount,
        referenceNumber: formData.referenceNumber,
        pieces: formData.pieces,
        productValue: formData.productValue,
        billingWeightKg: formData.billingWeightKg,
        billingWeightGm: formData.billingWeightGm,
        grossWeight: formData.grossWeight,
        itemType: formData.itemType,
        remarks: formData.remarks,
        itemDescription: formData.itemDescription,

        lengthCm: formData.lengthCm,
        widthCm: formData.widthCm,
        heightCm: formData.heightCm,
        dimensionalWeight: dimensionalWeight > 0 ? dimensionalWeight : undefined,
      }

      setBookingData(pdfData)
      setIsSuccess(true)
    } catch (error) {
      console.error("[v0] Error submitting form:", error)
      alert(`Error submitting booking: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownloadPDF = () => {
    if (bookingData) {
      downloadBookingPDF(bookingData)
    }
  }

  const handleNewBooking = () => {
    setIsSuccess(false)
    setBookingData(null)
    setFormData({
      shipperCompanyName: "",
      shipperContactPerson: "",
      shipperAddressLine: "",
      shipperCity: "",
      shipperZip: "",
      shipperState: "",
      shipperCountry: "",
      shipperPhone: "",
      shipperEmail: "",
      consigneeCompanyName: "",
      consigneeContactPerson: "",
      consigneeAddressLine: "",
      consigneeCity: "",
      consigneeZip: "",
      consigneeState: "",
      consigneeCountry: "",
      consigneePhone: "",
      consigneeEmail: "",
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
      lengthCm: "",
      widthCm: "",
      heightCm: "",
      dimPieces: "1",
    })
  }

  if (isSuccess && bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
          <Card className="border-green-200 shadow-lg">
            <CardHeader className="bg-green-50 border-b border-green-200 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <CardTitle className="text-2xl text-green-800">Booking Confirmed!</CardTitle>
              </div>
              <CardDescription className="text-green-700">Your shipment has been successfully booked</CardDescription>
            </CardHeader>
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">Booking Number</h3>
                <Badge variant="outline" className="text-lg px-4 py-2 bg-blue-50 text-blue-800 border-blue-200">
                  {bookingData.bookingNumber}
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-slate-600">
                  Your booking has been saved to our system. You can download your invoice below.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice PDF
                </Button>
                <Button onClick={handleNewBooking} variant="outline" size="lg">
                  Create New Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="container mx-auto py-10">
        {/* Header */}
        <div className="mb-8">
            <h2 className="text-3xl font-bold">ONLINE <span className="text-[#0253A3]">BOOKING</span></h2>
            <p className="font-medium">Complete the form below to book your shipment. All fields marked with * are required.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
          {/* Shipper Information */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="flex items-center gap-2 text-slate-900 text-2xl">
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
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipperContactPerson">Contact Person *</Label>
                  <Input
                    id="shipperContactPerson"
                    value={formData.shipperContactPerson}
                    onChange={(e) => handleInputChange("shipperContactPerson", e.target.value)}
                    required
                    className="border-slate-300"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="shipperAddressLine">Address Line *</Label>
                  <Input
                    id="shipperAddressLine"
                    value={formData.shipperAddressLine}
                    onChange={(e) => handleInputChange("shipperAddressLine", e.target.value)}
                    required
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipperCity">City *</Label>
                  <Input
                    id="shipperCity"
                    value={formData.shipperCity}
                    onChange={(e) => handleInputChange("shipperCity", e.target.value)}
                    required
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipperZip">ZIP Code *</Label>
                  <Input
                    id="shipperZip"
                    value={formData.shipperZip}
                    onChange={(e) => handleInputChange("shipperZip", e.target.value)}
                    required
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipperState">State *</Label>
                  <Input
                    id="shipperState"
                    value={formData.shipperState}
                    onChange={(e) => handleInputChange("shipperState", e.target.value)}
                    required
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipperCountry">Country *</Label>
                  <Select
                    value={formData.shipperCountry}
                    onValueChange={(value) => handleInputChange("shipperCountry", value)}
                  >
                    <SelectTrigger className="border-slate-300">
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
                    className="border-slate-300"
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
                    className="border-slate-300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consignee Information */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="flex items-center gap-2 text-slate-900 text-2xl">
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
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consigneeContactPerson">Contact Person *</Label>
                  <Input
                    id="consigneeContactPerson"
                    value={formData.consigneeContactPerson}
                    onChange={(e) => handleInputChange("consigneeContactPerson", e.target.value)}
                    required
                    className="border-slate-300"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="consigneeAddressLine">Address Line *</Label>
                  <Input
                    id="consigneeAddressLine"
                    value={formData.consigneeAddressLine}
                    onChange={(e) => handleInputChange("consigneeAddressLine", e.target.value)}
                    required
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consigneeCity">City *</Label>
                  <Input
                    id="consigneeCity"
                    value={formData.consigneeCity}
                    onChange={(e) => handleInputChange("consigneeCity", e.target.value)}
                    required
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consigneeZip">ZIP Code *</Label>
                  <Input
                    id="consigneeZip"
                    value={formData.consigneeZip}
                    onChange={(e) => handleInputChange("consigneeZip", e.target.value)}
                    required
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consigneeState">State *</Label>
                  <Input
                    id="consigneeState"
                    value={formData.consigneeState}
                    onChange={(e) => handleInputChange("consigneeState", e.target.value)}
                    required
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consigneeCountry">Country *</Label>
                  <Select
                    value={formData.consigneeCountry}
                    onValueChange={(value) => handleInputChange("consigneeCountry", value)}
                  >
                    <SelectTrigger className="border-slate-300">
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
                    className="border-slate-300"
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
                    className="border-slate-300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipment Information */}
          <Card className="border-slate-200 shadow-sm col-span-2">
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="flex items-center gap-2 text-slate-900 text-2xl">
                Shipment Information
              </CardTitle>
              <CardDescription>Package details and payment information</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="paymentMode">Payment Mode *</Label>
                  <Select
                    value={formData.paymentMode}
                    onValueChange={(value) => handleInputChange("paymentMode", value)}
                  >
                    <SelectTrigger className="border-slate-300">
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
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referenceNumber">Ref (if any)</Label>
                  <Input
                    id="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={(e) => handleInputChange("referenceNumber", e.target.value)}
                    className="border-slate-300"
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
                    className="border-slate-300"
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
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="billingWeightKg">Billing Weight (kg)</Label>
                    <Input
                      id="billingWeightKg"
                      type="number"
                      step="0.001"
                      value={formData.billingWeightKg}
                      onChange={(e) => handleInputChange("billingWeightKg", e.target.value)}
                      className="border-slate-300"
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
                      className="border-slate-300"
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
                      className="border-slate-300 bg-slate-300"
                      readOnly
                      title="Auto-calculated as the higher of billing weight or dimensional weight"
                    />
                  </div>
                <div className="space-y-2">
                  <Label htmlFor="itemType">Item Type *</Label>
                  <Select value={formData.itemType} onValueChange={(value) => handleInputChange("itemType", value)}>
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="Select item type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SPX">SPX (Express)</SelectItem>
                      <SelectItem value="Docs">Documents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="remarks">Remarks (if any)</Label>
                    <Textarea
                      id="remarks"
                      value={formData.remarks}
                      onChange={(e) => handleInputChange("remarks", e.target.value)}
                      className="border-slate-300"
                      rows={2}
                    />
                  </div>
                <div className="space-y-2 col-span-4">
                    <Label htmlFor="itemDescription">Item Description Input goods decsription with quantity. For HAWB Print And Manefiest Creating *</Label>
                    <Textarea
                      id="itemDescription"
                      placeholder="Pant 05 Pcs, Shirt 02 Pcs, Scarf 01 Pcs..."
                      value={formData.itemDescription}
                      onChange={(e) => handleInputChange("itemDescription", e.target.value)}
                      required
                      className="border-slate-300"
                      rows={3}
                    />
                  </div>
              </div>
    
              {/* Dimensional Weight Calculator */}
              <div className="space-y-4 mt-5">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">Dimensional Weight (if any)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="lengthCm">Length (cm)</Label>
                    <Input
                      id="lengthCm"
                      type="number"
                      step="0.01"
                      value={formData.lengthCm}
                      onChange={(e) => handleInputChange("lengthCm", e.target.value)}
                      className="border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="widthCm">Width (cm)</Label>
                    <Input
                      id="widthCm"
                      type="number"
                      step="0.01"
                      value={formData.widthCm}
                      onChange={(e) => handleInputChange("widthCm", e.target.value)}
                      className="border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heightCm">Height (cm)</Label>
                    <Input
                      id="heightCm"
                      type="number"
                      step="0.01"
                      value={formData.heightCm}
                      onChange={(e) => handleInputChange("heightCm", e.target.value)}
                      className="border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimPieces">Pcs.</Label>
                    <Input
                      id="dimPieces"
                      type="number"
                      min="1"
                      value={formData.dimPieces}
                      onChange={(e) => handleInputChange("dimPieces", e.target.value)}
                      className="border-slate-300"
                    />
                  </div>
                </div>
                {dimensionalWeight > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Calculated Dimensional Weight: {dimensionalWeight.toFixed(3)} kg
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-700 mt-2">Formula: (Length × Width × Height × Pcs) ÷ 5000</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="bg-[#0253A3] hover:bg-[#004285] text-white px-8 py-3 text-lg font-semibold cursor-pointer"
            >
              {isSubmitting ? "Processing..." : "Submit Booking"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
