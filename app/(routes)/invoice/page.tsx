"use client"

import { BookingData, generateBookingHTML } from "@/lib/pdf-generator"
import React, { useEffect, useRef, useState } from "react"
import JsBarcode from "jsbarcode"

const defaultBooking: BookingData = {
  bookingNumber: "ABC123456",
  createdAt: new Date().toISOString(),
  shipperCompanyName: "Shipper Co.",
  shipperContactPerson: "John Doe",
  shipperAddressLine: "123 Shipping St",
  shipperCity: "New York",
  shipperZip: "10001",
  shipperState: "NY",
  shipperCountry: "USA",
  shipperPhone: "+1 555-1234",
  shipperEmail: "shipper@example.com",
  consigneeCompanyName: "Consignee Inc.",
  consigneeContactPerson: "Jane Smith",
  consigneeAddressLine: "456 Receiving Rd",
  consigneeCity: "Los Angeles",
  consigneeZip: "90001",
  consigneeState: "CA",
  consigneeCountry: "USA",
  consigneePhone: "+1 555-5678",
  consigneeEmail: "consignee@example.com",
  paymentMode: "Prepaid",
  amount: "150.00",
  referenceNumber: "REF123",
  pieces: "2",
  productValue: "500",
  billingWeightKg: "5",
  billingWeightGm: "300",
  grossWeight: "5.6",
  itemType: "Electronics",
  remarks: "Handle with care",
  itemDescription: "Laptops and accessories",
  lengthCm: "50",
  widthCm: "40",
  heightCm: "30",
  dimensionalWeight: 12,
}

export default function InvoiceEditor() {
  const [bookingData, setBookingData] = useState<BookingData>(defaultBooking)
  const [logoBase64, setLogoBase64] = useState<string>("")
  const previewRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Load logo from public folder and convert to base64
    async function loadLogo() {
      try {
        const response = await fetch("/logo.png")
        const blob = await response.blob()
        const reader = new FileReader()
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setLogoBase64(reader.result)
          }
        }
        reader.readAsDataURL(blob)
      } catch (err) {
        console.error("Failed to load logo:", err)
      }
    }

    loadLogo()
  }, [])

  useEffect(() => {
    if (!previewRef.current) return
    const trackingNumber = bookingData.bookingNumber.replace(/[^A-Z0-9]/g, "").toUpperCase()
    const barcodeSvg = previewRef.current.querySelector(`#barcode-${trackingNumber}`)

    if (barcodeSvg) {
      try {
        JsBarcode(barcodeSvg as HTMLElement, trackingNumber, {
          format: "CODE128",
          width: 2,
          height: 40,
          displayValue: false,
          margin: 0,
        })
      } catch (err) {
        console.error("Error rendering barcode in preview:", err)
      }
    }
  }, [bookingData, logoBase64])

  return (
    <div style={{ display: "flex", gap: "30px", padding: "20px" }}>
      {/* Live Preview Section */}
      <div
        style={{
          flex: 1,
          border: "1px solid #ddd",
          padding: "15px",
          background: "#fff",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ marginBottom: "16px" }}>Live Preview</h2>
        {logoBase64 ? (
          <div ref={previewRef} dangerouslySetInnerHTML={{ __html: generateBookingHTML(bookingData, logoBase64) }} />
        ) : (
          <p>Loading preview...</p>
        )}
      </div>
    </div>
  )
}
