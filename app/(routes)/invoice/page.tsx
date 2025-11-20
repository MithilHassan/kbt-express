"use client"

import React, { useEffect, useRef, useState } from "react"
import JsBarcode from "jsbarcode"
import { BookingData, generateBookingHTML, generateCommercialInvoiceHTML } from "@/lib/pdf-generator"

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
  shipperRegistrationType: "BIN",
  shipperRegistrationNumber: "123456789",
  consigneeCompanyName: "Consignee Inc.",
  consigneeContactPerson: "Jane Smith",
  consigneeAddressLine: "456 Receiving Rd",
  consigneeCity: "Los Angeles",
  consigneeZip: "90001",
  consigneeState: "CA",
  consigneeCountry: "USA",
  consigneePhone: "+1 555-5678",
  consigneeEmail: "consignee@example.com",
  consigneeRegistrationType: "GIST",
  consigneeRegistrationNumber: "1233456789",
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
  const bookingPreviewRef = useRef<HTMLDivElement | null>(null)
  const commercialPreviewRef = useRef<HTMLDivElement | null>(null)

  // Load logo from public folder
  useEffect(() => {
    async function loadLogo() {
      try {
        const response = await fetch("/logo.png")
        const blob = await response.blob()
        const reader = new FileReader()
        reader.onloadend = () => {
          if (typeof reader.result === "string") setLogoBase64(reader.result)
        }
        reader.readAsDataURL(blob)
      } catch (err) {
        console.error("Failed to load logo:", err)
      }
    }

    loadLogo()
  }, [])

  // Render barcode in both previews
  useEffect(() => {
  if (!logoBase64) return;

  const renderBarcode = (ref: React.RefObject<HTMLDivElement>, prefix: string) => {
    if (!ref.current) return;

    const trackingNumber = bookingData.bookingNumber.replace(/[^A-Z0-9]/g, "").toUpperCase();
    const barcodeId = `#${prefix}${trackingNumber}`;
    const svg = ref.current.querySelector(barcodeId);

    if (svg) {
      try {
        JsBarcode(svg as HTMLElement, trackingNumber, {
          format: "CODE128",
          width: 2,
          height: 40,
          displayValue: false,
          margin: 0,
        });
      } catch (err) {
        console.error(`Error rendering ${prefix} barcode:`, err);
      }
    } else {
      console.warn(`Barcode element ${barcodeId} not found`);
    }
  };

  renderBarcode(bookingPreviewRef, "barcode-");     // Booking invoice
  renderBarcode(commercialPreviewRef, "barcode-ci-"); // Commercial invoice
}, [bookingData, logoBase64]);


  return (
    <div style={{ display: "flex", gap: "30px", padding: "20px", flexWrap: "wrap" }}>
      {/* Booking Preview */}
      <div
        style={{
          flex: 1,
          border: "1px solid #ddd",
          padding: "15px",
          background: "#fff",
          maxHeight: "90vh",
          overflowY: "auto",
          minWidth: "450px",
        }}
      >
        <h2 style={{ marginBottom: "16px" }}>Booking Invoice Preview</h2>
        {logoBase64 ? (
          <div
            ref={bookingPreviewRef}
            dangerouslySetInnerHTML={{ __html: generateBookingHTML(bookingData, logoBase64) }}
          />
        ) : (
          <p>Loading preview...</p>
        )}
      </div>

      {/* Commercial Invoice Preview */}
      <div
        style={{
          flex: 1,
          border: "1px solid #ddd",
          padding: "15px",
          background: "#fff",
          maxHeight: "90vh",
          overflowY: "auto",
          minWidth: "450px",
        }}
      >
        <h2 style={{ marginBottom: "16px" }}>Commercial Invoice Preview</h2>
        {logoBase64 ? (
          <div
            ref={commercialPreviewRef}
            dangerouslySetInnerHTML={{ __html: generateCommercialInvoiceHTML(bookingData) }}
          />
        ) : (
          <p>Loading preview...</p>
        )}
      </div>
    </div>
  )
}
