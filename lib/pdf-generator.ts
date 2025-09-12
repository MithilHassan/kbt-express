import jsPDF from "jspdf"

export interface BookingData {
  bookingNumber: string
  createdAt: string

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
  amount?: string
  referenceNumber?: string
  pieces: string
  productValue?: string
  billingWeightKg?: string
  billingWeightGm?: string
  grossWeight?: string
  itemType: string
  remarks?: string
  itemDescription: string

  // Dimensions
  lengthCm?: string
  widthCm?: string
  heightCm?: string
  dimensionalWeight?: number
}

export function generateBookingPDF(bookingData: BookingData): jsPDF {
  const doc = new jsPDF()

  // Set up colors matching the KBT Express design
  const headerGray = [128, 128, 128] // Gray header sections
  const darkGray = [64, 64, 64] // Dark text
  const lightGray = [240, 240, 240] // Light backgrounds
  const black = [0, 0, 0]

  let yPosition = 15

  // Header with company name and barcode
  doc.setTextColor(...black)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("KBT EXPRESS", 20, yPosition)

  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text("GLOBAL LOGISTICS SOLUTIONS", 20, yPosition + 5)

  // Barcode area (simulated with text)
  doc.setFontSize(10)
  doc.text("||||||||||||||||||||||||||||||||", 150, yPosition)
  doc.text(`EX${bookingData.bookingNumber}`, 150, yPosition + 8)

  yPosition += 20

  // Main header section with gray background
  doc.setFillColor(...headerGray)
  doc.rect(15, yPosition, 180, 8, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("KBT EXPRESS", 20, yPosition + 5)
  doc.text("ORIGIN", 85, yPosition + 5)
  doc.text("DESTINATION", 125, yPosition + 5)
  doc.text("BOOKING DATE", 165, yPosition + 5)

  yPosition += 12

  // Origin, Destination, Date row
  doc.setTextColor(...black)
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text(bookingData.shipperCountry.toUpperCase(), 85, yPosition)
  doc.text(bookingData.consigneeCountry.toUpperCase(), 125, yPosition)
  doc.text(new Date(bookingData.createdAt).toLocaleDateString("en-GB"), 165, yPosition)

  yPosition += 15

  // Shipper section
  doc.setFillColor(...headerGray)
  doc.rect(15, yPosition, 90, 6, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text("SHIPPER NAME AND ADDRESS", 18, yPosition + 4)

  yPosition += 10

  // Shipper details box
  doc.setDrawColor(...darkGray)
  doc.rect(15, yPosition, 90, 35)

  doc.setTextColor(...black)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text(bookingData.shipperCompanyName.toUpperCase(), 18, yPosition + 5)
  doc.text(bookingData.shipperAddressLine, 18, yPosition + 10)
  doc.text(`${bookingData.shipperCity}, ${bookingData.shipperState}`, 18, yPosition + 15)
  doc.text(`${bookingData.shipperCountry}: ${bookingData.shipperZip}`, 18, yPosition + 20)

  // Contact details in shipper box
  const shipperContactY = yPosition + 28
  doc.text("Contact Person", 18, shipperContactY)
  doc.text("Email Id", 55, shipperContactY)
  doc.text("Postal/Zip Code", 18, shipperContactY + 7)
  doc.text("Telephone", 55, shipperContactY + 7)
  doc.text("Mobile", 85, shipperContactY + 7)

  // Consignment details section (center)
  const centerX = 110
  doc.setFillColor(...headerGray)
  doc.rect(centerX, yPosition - 10, 50, 6, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text("CONSIGNMENT(SHIPMENT) DETAILS", centerX + 2, yPosition - 6)

  // Consignment details table
  doc.setTextColor(...black)
  doc.setFontSize(7)
  doc.setFont("helvetica", "normal")

  const consignmentY = yPosition
  doc.rect(centerX, consignmentY, 50, 25)

  // Table rows
  doc.text("NUMBER OF PACKAGE", centerX + 2, consignmentY + 4)
  doc.text(bookingData.pieces, centerX + 35, consignmentY + 4)
  doc.text("A.WEIGHT(KG)", centerX + 40, consignmentY + 4)
  doc.text(bookingData.billingWeightKg || "0", centerX + 45, consignmentY + 8)

  doc.text("VOL WEIGHT (KG)", centerX + 2, consignmentY + 8)
  doc.text(bookingData.dimensionalWeight?.toFixed(2) || "0.00", centerX + 35, consignmentY + 8)

  doc.text("VALUE FOR CUSTOMS (USD)", centerX + 2, consignmentY + 12)
  doc.text(bookingData.productValue || "0.00", centerX + 35, consignmentY + 12)

  doc.text("FREIGHT BILL TO", centerX + 2, consignmentY + 16)
  doc.text("CONSIGNEE", centerX + 35, consignmentY + 16)

  doc.text("DUTIES & TAXES BILL TO", centerX + 2, consignmentY + 20)
  doc.text("CONSIGNEE", centerX + 35, consignmentY + 20)

  // Service mode section (right)
  const rightX = 165
  doc.setFillColor(...headerGray)
  doc.rect(rightX, yPosition - 10, 30, 6, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text("SERVICE MODE", rightX + 2, yPosition - 6)

  doc.setTextColor(...black)
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.rect(rightX, consignmentY, 30, 12)
  doc.text(bookingData.paymentMode.toUpperCase(), rightX + 5, consignmentY + 8)

  // Shipment type
  doc.setFillColor(...headerGray)
  doc.rect(rightX, consignmentY + 15, 30, 6, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text("SHIPMENT TYPE", rightX + 2, consignmentY + 19)

  doc.setTextColor(...black)
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.rect(rightX, consignmentY + 21, 30, 12)
  doc.text(bookingData.itemType, rightX + 5, consignmentY + 28)

  yPosition += 45

  // Consignee section
  doc.setFillColor(...headerGray)
  doc.rect(15, yPosition, 90, 6, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text("CONSIGNEE NAME AND ADDRESS", 18, yPosition + 4)

  yPosition += 10

  // Consignee details box
  doc.rect(15, yPosition, 90, 35)

  doc.setTextColor(...black)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text(bookingData.consigneeCompanyName.toUpperCase(), 18, yPosition + 5)
  doc.text(bookingData.consigneeAddressLine, 18, yPosition + 10)
  doc.text(`${bookingData.consigneeCity}, ${bookingData.consigneeState}`, 18, yPosition + 15)
  doc.text(`BIN NO: ${bookingData.referenceNumber || "N/A"}`, 18, yPosition + 20)

  // Contact details in consignee box
  const consigneeContactY = yPosition + 28
  doc.text("Contact Person", 18, consigneeContactY)
  doc.text("Email Id", 55, consigneeContactY)
  doc.text("Postal/Zip Code", 18, consigneeContactY + 7)
  doc.text("Telephone", 55, consigneeContactY + 7)
  doc.text("Mobile", 85, consigneeContactY + 7)

  // Description of goods section
  doc.setFillColor(...headerGray)
  doc.rect(centerX, yPosition, 50, 6, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text("DESCRIPTION OF GOODS", centerX + 2, yPosition + 4)

  doc.setTextColor(...black)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.rect(centerX, yPosition + 6, 50, 29)

  const splitDescription = doc.splitTextToSize(bookingData.itemDescription, 45)
  doc.text(splitDescription, centerX + 2, yPosition + 12)

  // Shipper declaration (right side)
  doc.setFillColor(...headerGray)
  doc.rect(rightX, yPosition, 30, 6, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text("SHIPPER DECLARATION", rightX + 2, yPosition + 4)

  doc.setTextColor(...black)
  doc.setFontSize(6)
  doc.setFont("helvetica", "normal")
  doc.rect(rightX, yPosition + 6, 30, 29)
  doc.text("non-negotiable consignment note subject", rightX + 2, yPosition + 10)
  doc.text("to standard conditions of carriage", rightX + 2, yPosition + 13)
  doc.text("shown on reverse side.", rightX + 2, yPosition + 16)
  doc.text("the carriage specifically limits its liability", rightX + 2, yPosition + 19)
  doc.text("to maximum of use$100.00 per", rightX + 2, yPosition + 22)
  doc.text("consignment for any cause", rightX + 2, yPosition + 25)

  doc.text("SHIPPER's", rightX + 2, yPosition + 30)
  doc.text("SIGNATURE:_______________", rightX + 2, yPosition + 33)
  doc.text("DATE:_______________", rightX + 2, yPosition + 36)

  yPosition += 45

  // Delivery section
  doc.setFillColor(...headerGray)
  doc.rect(15, yPosition, 90, 6, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text("DELIVERY NAME AND ADDRESS", 18, yPosition + 4)

  yPosition += 10

  // Delivery details (same as consignee)
  doc.rect(15, yPosition, 90, 35)
  doc.setTextColor(...black)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text(bookingData.consigneeCompanyName.toUpperCase(), 18, yPosition + 5)
  doc.text(bookingData.consigneeAddressLine, 18, yPosition + 10)
  doc.text(`${bookingData.consigneeCity}, ${bookingData.consigneeState}`, 18, yPosition + 15)
  doc.text(`BIN NO: ${bookingData.referenceNumber || "N/A"}`, 18, yPosition + 20)

  // Dimensions section
  doc.setFillColor(...headerGray)
  doc.rect(centerX, yPosition, 50, 6, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text("DIMENSION IN CM(VOLUME RATIO 5000)", centerX + 2, yPosition + 4)

  doc.setTextColor(...black)
  doc.setFontSize(7)
  doc.setFont("helvetica", "normal")
  doc.rect(centerX, yPosition + 6, 50, 29)

  // Dimension table headers
  doc.text("L", centerX + 5, yPosition + 12)
  doc.text("W", centerX + 15, yPosition + 12)
  doc.text("H", centerX + 25, yPosition + 12)
  doc.text("Pcs", centerX + 35, yPosition + 12)
  doc.text("L", centerX + 45, yPosition + 12)

  // Dimension values
  doc.text(bookingData.lengthCm || "0", centerX + 5, yPosition + 18)
  doc.text(bookingData.widthCm || "0", centerX + 15, yPosition + 18)
  doc.text(bookingData.heightCm || "0", centerX + 25, yPosition + 18)
  doc.text(bookingData.pieces, centerX + 35, yPosition + 18)

  doc.text(`VOLUMETRIC WEIGHT: ${bookingData.dimensionalWeight?.toFixed(2) || "0.00"}`, centerX + 2, yPosition + 28)

  doc.text("Received in Good Condition By Consignee.", centerX + 2, yPosition + 32)
  doc.text("SIGNATURE:-_______________", centerX + 2, yPosition + 36)
  doc.text("DATE:- _______________     TIME:-___________", centerX + 2, yPosition + 40)

  // Reference number section (right)
  doc.setFillColor(...headerGray)
  doc.rect(rightX, yPosition, 30, 6, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text("REFERENCE NUMBER", rightX + 2, yPosition + 4)

  doc.setTextColor(...black)
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.rect(rightX, yPosition + 6, 30, 15)
  doc.text(bookingData.referenceNumber || bookingData.bookingNumber, rightX + 2, yPosition + 15)

  // Footer
  yPosition += 50
  doc.setFillColor(...headerGray)
  doc.rect(0, yPosition, 210, 8, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("Email : support@kbtexpress.net", 20, yPosition + 5)

  return doc
}

export function downloadBookingPDF(bookingData: BookingData) {
  const doc = generateBookingPDF(bookingData)
  doc.save(`booking-${bookingData.bookingNumber}.pdf`)
}
