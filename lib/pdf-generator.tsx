// Declare BookingData type or import it from the appropriate module
export type BookingData = {
  bookingNumber: string
  createdAt: string
  shipperCompanyName: string
  shipperContactPerson: string
  shipperAddressLine: string
  shipperCity: string
  shipperZip: string
  shipperState: string
  shipperCountry: string
  shipperPhone: string
  shipperEmail: string
  consigneeCompanyName: string
  consigneeContactPerson: string
  consigneeAddressLine: string
  consigneeCity: string
  consigneeZip: string
  consigneeState: string
  consigneeCountry: string
  consigneePhone: string
  consigneeEmail: string
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
  lengthCm?: string
  widthCm?: string
  heightCm?: string
  dimensionalWeight?: number
  packages?: Array<{
    billingWeightKg: number
    billingWeightGm: number
    grossWeight: number
    lengthCm: number
    widthCm: number
    heightCm: number
    pieces: number
    dimensionalWeight: number
    description: string
  }>
}

export function generateBookingHTML(bookingData: BookingData, logoBase64: string): string {
  // Generate tracking number for barcode
  const trackingNumber = bookingData.bookingNumber.replace(/[^A-Z0-9]/g, "").toUpperCase()

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            font-size: 11px;
            color: #000;
            background: #fff;
            padding: 20px;
          }
          .invoice-container {
            padding: 0;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 15px 20px;
          }
          .barcode-section {
            text-align: right;
          }
          .barcode-container {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }
          .barcode-image {
            margin-bottom: 5px;
          }
          .tracking-number {
            font-family: 'Courier New', monospace;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
          }
          .info-row {
            display: flex;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .section-header {
            background: #777;
            color: #fff;
            font-weight: bold;
            padding: 0px 5px 10px 5px;
            text-transform: uppercase;
            font-size: 10px;
          }
          .col {
            border: 5px solid #000;
            padding: 1px;
            flex: 1;
          }
          .col:last-child {
            border-right: none;
          }
          .col-narrow {
            flex: 0.8;
            border-left: 5px solid #777;
            border-right: 5px solid #777;

          }
          .col-wide {
            flex: 1.5;
            border-left: 5px solid #777;
          }
          .field-label {
            font-weight: bold;
            font-size: 9px;
            color: #333;
            margin-bottom: 3px;
            text-transform: uppercase;
          }
          .field-value {
            font-size: 11px;
            color: #333;
            line-height: 1.4;
          }
          .field-group {
            border: 2px solid #777;
            padding: 5px;
          }
          .field-group:last-child {
            margin-bottom: 0;
          }
          .inline-fields {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .inline-fields .field-group {
            height: 100%;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
          }
          .table th {
            background: #ddd;
            padding: 5px;
            text-align: center;
            font-size: 9px;
            font-weight: bold;
            border: 1px solid #777;
          }
          .table td {
            padding: 5px;
            text-align: center;
            border: 1px solid #777;
            font-size: 10px;
          }
          .signature-box {
            min-height: 60px;
            border: 1px solid #ccc;
            margin-top: 5px;
            background: #fafafa;
          }
          .footer {
            background: #777;
            color: #fff;
            text-align: center;
            padding: 8px;
            font-size: 11px;
          }
          .declaration-text {
            font-size: 9px;
            line-height: 1.5;
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">

           <!-- Header --> 

          <div class="header">
            <div>
              <img src="${logoBase64}" alt="KBT EXPRESS" width="300px">
            </div>
            <div class="barcode-section">
              <div class="barcode-container">
                <svg id="barcode-${trackingNumber}" class="barcode-image"></svg>
                <div class="tracking-number">${trackingNumber}</div>
              </div>
            </div>
          </div>

           <!-- Main Content Row   --> 

          <div class="info-row">

          <!-- Left Column  --> 

            <div class="col-wide">
              <div class="section-header"">KBT EXPRESS</div>
              <div style="padding: 3px">
                <div class="field-value" style="font-weight: bold; border: 2px solid #777; padding: 5px;">Plot # 34, HM Plaza, Floor # 7, Room# 703, Sector # 03, Uttara, Dhaka-1230, Bangladesh</div>
              </div>
              <div class="section-header">Shipper Name and Address</div>
              <div style="padding: 5px;">
                <div class="field-group" style="border-bottom: 0">
                  <div class="field-value" style="font-weight: bold;">${bookingData.shipperCompanyName}</div>
                  <div class="field-value">${bookingData.shipperAddressLine}</div>
                  <div class="field-value">${bookingData.shipperCity}, ${bookingData.shipperState}</div>
                  <div class="field-value">${bookingData.shipperCountry}</div>
                </div>
                <div class="inline-fields">
                  <div class="field-group" style="border-bottom: 0; border-right: 0">
                    <div class="field-label">Contact Person</div>
                    <div class="field-value">${bookingData.shipperContactPerson}</div>
                  </div>
                  <div class="field-group" style="border-bottom: 0;">
                    <div class="field-label">Email Id</div>
                    <div class="field-value">${bookingData.shipperEmail}</div>
                  </div>
                </div>
                <div class="inline-fields">
                  <div class="field-group" style="border-right: 0">
                    <div class="field-label">Postal/Zip Code</div>
                    <div class="field-value">${bookingData.shipperZip}</div>
                  </div>
                  <div class="field-group">
                    <div class="field-label">Telephone</div>
                    <div class="field-value">${bookingData.shipperPhone}</div>
                  </div>
                </div>
              </div>

              <!-- Consignee  --> 

                
              <div class="section-header">Consignee Name and Address</div>
              <div style="padding: 5px;">
                <div class="field-group" style="border-bottom: 0;">
                  <div class="field-value" style="font-weight: bold;">${bookingData.consigneeCompanyName}</div>
                  <div class="field-value">${bookingData.consigneeAddressLine}</div>
                  <div class="field-value">${bookingData.consigneeCity}, ${bookingData.consigneeState}</div>
                  <div class="field-value">${bookingData.consigneeCountry}</div>
                </div>
                <div class="inline-fields">
                  <div class="field-group" style="border-bottom: 0; border-right: 0;">
                    <div class="field-label">Contact Person</div>
                    <div class="field-value">${bookingData.consigneeContactPerson}</div>
                  </div>
                  <div class="field-group" style="border-bottom: 0;">
                    <div class="field-label">Email Id</div>
                    <div class="field-value">${bookingData.consigneeEmail}</div>
                  </div>
                </div>
                <div class="inline-fields">
                  <div class="field-group" style="border-right: 0;">
                    <div class="field-label">Postal/Zip Code</div>
                    <div class="field-value">${bookingData.consigneeZip}</div>
                  </div>
                  <div class="field-group">
                    <div class="field-label">Telephone</div>
                    <div class="field-value">${bookingData.consigneePhone}</div>
                  </div>
                </div>
              </div>

              <!-- Delivery Address  --> 

              <div class="section-header">Delivery Name and Address</div>
              <div style="padding: 5px;">
                <div class="field-group" style="border-bottom: 0;">
                  <div class="field-value" style="font-weight: bold;">${bookingData.consigneeCompanyName}</div>
                  <div class="field-value">${bookingData.consigneeAddressLine}</div>
                  <div class="field-value">${bookingData.consigneeCity}, ${bookingData.consigneeState}</div>
                  <div class="field-value">${bookingData.consigneeCountry}</div>
                </div>
                <div class="inline-fields">
                  <div class="field-group" style="border-right: 0;">
                    <div class="field-label">Postal/Zip Code</div>
                    <div class="field-value">${bookingData.consigneeZip}</div>
                  </div>
                  <div class="field-group">
                    <div class="field-label">Telephone</div>
                    <div class="field-value">${bookingData.consigneePhone}</div>
                  </div>
                </div>
              </div>
            </div>

              <!-- Middle Column   --> 
             
            <div class="col-wide">
              <div style="display: flex;">
                <div style="flex: 1; border-right: 5px solid #777;">
                  <div class="section-header" style="text-align: center;">Origin</div>
                  <div style="padding: 3px;"> 
                    <div class="field-value" style="font-weight: bold; text-align: center; border: 2px solid #777;" >${bookingData.shipperCountry}</div>
                  </div>
                </div>
                <div style="flex: 1;">
                  <div class="section-header" style="text-align: center;">Destination</div>
                  <div style="padding: 3px;"> 
                  <div class="field-value" style="font-weight: bold; text-align: center; border: 2px solid #777;">${bookingData.consigneeCountry}</div>
                  </div>
                </div>
              </div>
              <div class="section-header">Consignment (Shipment) Details</div>
              <div style="padding: 3px;">
                <div class="inline-fields">
                  <div class="field-group" style= "display: flex; padding: 0px 5px; align-items: center; border-bottom: 0; border-right: 0;">
                    <div class="field-label" style="flex:3; border-right: 2px solid #777;">Number of Package</div>
                    <div class="field-value" style="flex:1; text-align: center">${bookingData.pieces}</div>
                  </div>
                  <div class="field-group" style="display: flex; padding: 0px 5px; align-items: center; border-bottom: 0;">
                    <div class="field-label" style="flex:3; border-right: 2px solid #777;">A.Weight (KG)</div>
                    <div class="field-value" style="flex:1; text-align: center">${bookingData.billingWeightKg}</div>
                  </div>
                </div>
                <div class="field-group" style="border-bottom: 0;">
                  <div class="field-label">Vol Weight (KG)</div>
                  <div class="field-value">${bookingData.dimensionalWeight || "N/A"}</div>
                </div>
                <div class="field-group" style="border-bottom: 0;">
                  <div class="field-label">Value for Customs (USD)</div>
                  <div class="field-value">${bookingData.productValue || "N/A"}</div>
                </div>
                <div class="inline-fields">
                  <div class="field-group" style="border-right: 0;">
                    <div class="field-label">Freight Bill To</div>
                    <div class="field-value">${bookingData.paymentMode === "prepaid" ? "SHIPPER" : "CONSIGNEE"}</div>
                  </div>
                  <div class="field-group">
                    <div class="field-label">Duties & Taxes Bill To</div>
                    <div class="field-value">CONSIGNEE</div>
                  </div>
                </div>
              </div>

              <!-- Description of Goods   --> 

              <div class="section-header">Description of Goods</div>
              <div style="padding: 3px">
              <div style="padding: 5px; min-height: 80px; border: 2px solid #777">
                <div class="field-value">${bookingData.itemDescription}</div>
              </div>
              </div>
              <div class="section-header">Dimension in CM (Volume Ratio 5000)</div>
              <div style="padding: 3px;">
                <table class="table">
                  <thead>
                    <tr>
                      <th>L</th>
                      <th>W</th>
                      <th>H</th>
                      <th>Pcs</th>
                      <th>L</th>
                      <th>W</th>
                      <th>H</th>
                      <th>Pcs</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${bookingData.lengthCm || ""}</td>
                      <td>${bookingData.widthCm || ""}</td>
                      <td>${bookingData.heightCm || ""}</td>
                      <td>${bookingData.pieces || ""}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colspan="4"></td>
                      <td colspan="4" style="text-align: right; font-weight: bold;">
                        VOLUMETRIC WEIGHT: ${bookingData.dimensionalWeight || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Signature Section    --> 

              <div style="padding: 5px; display:grid; gap:10px;">
                <div class="field-label">Received in Good Condition By Consignee.</div>
                <div class="field-label">SIGNATURE: ____________________</div>
                <div class="inline-fields">
                    <div class="field-label">DATE: ____________________</div>
                    <div class="field-label">TIME: ____________________</div>
                </div>
              </div>
            </div>

              <!-- Right Column  --> 

             
            <div class="col-narrow">
              <div class="section-header">Booking Date</div>
              <div style="padding: 3px;">
                <div class="field-value" style="font-weight: bold; text-align: center; border: 2px solid #777;">${new Date(bookingData.createdAt).toLocaleDateString("en-GB")}</div>
              </div>
              <div class="section-header">Service Mode</div>
              <div style="padding: 3px;">
                <div class="field-value" style="font-weight: bold; text-align: center; padding: 10px; border: 2px solid #777;">
                  EXPRESS
                </div>
              </div>

              <div class="section-header">Shipment Type</div>
              <div style="padding: 3px;">
                <div class="field-value" style="font-weight: bold; text-align: center; padding: 10px; border: 2px solid #777;">
                  ${bookingData.itemType}
                </div>
              </div>

              <div class="section-header">Shipper Declaration</div>
              <div style="padding: 3px;">
                <div class="declaration-text">
                  non-negotiate consignment note subject to standard conditions of carriage shown on reverse side.
                  <br/>
                  the carriage specifically limits its liability to USD100.00 per consignment for any cause
                </div>
                <div class="field-label" style="margin: 10px 0px;">SHIPPER's SIGNATURE:______________________</div>
                <div class="field-label">DATE:__________________________</div>
              </div>

              <!-- Reference Number  --> 

                
              <div class="section-header">Reference Number</div>
              <div style="padding: 3px;">
                <div class="field-value" style="font-weight: bold; text-align: center; padding: 10px; padding: 8px; border: 2px solid #777;">
                  ${bookingData.referenceNumber || bookingData.bookingNumber}
                </div>
              </div>
            </div>
          </div>

          <!-- Footer  --> 
            
          <div class="footer">
            Email: support@kbtexpress.net
          </div>
        </div>
      </body>
    </html>
  `
}

import { getBase64Logo } from "./getBase64Logo" // adjust the path accordingly

export async function downloadBookingPDF(bookingData: BookingData) {
  try {
    console.log("[v0] Starting PDF generation...")

    const jsPDF = (await import("jspdf")).default
    const html2canvas = (await import("html2canvas")).default
    const JsBarcode = (await import("jsbarcode")).default

    console.log("[v0] Libraries loaded successfully")

    const logoBase64 = await getBase64Logo()

    // Create a temporary container for the HTML
    const container = document.createElement("div")
    container.innerHTML = generateBookingHTML(bookingData, logoBase64)
    container.style.position = "absolute"
    container.style.left = "-9999px"
    container.style.width = "210mm" // A4 width
    container.style.padding = "20px"
    container.style.backgroundColor = "white"
    document.body.appendChild(container)

    console.log("[v0] Container created and added to DOM")

    const trackingNumber = bookingData.bookingNumber.replace(/[^A-Z0-9]/g, "").toUpperCase()
    const barcodeElement = container.querySelector(`#barcode-${trackingNumber}`)

    if (barcodeElement) {
      try {
        JsBarcode(barcodeElement, trackingNumber, {
          format: "CODE128",
          width: 2,
          height: 50,
          displayValue: false,
          margin: 0,
        })
        console.log("[v0] Barcode generated successfully")
      } catch (barcodeError) {
        console.error("[v0] Error generating barcode:", barcodeError)
      }
    }

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    console.log("[v0] Canvas created from HTML")

    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? "portrait" : "portrait",
      unit: "mm",
      format: "a4",
    })

    const imgData = canvas.toDataURL("image/png")
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

    console.log("[v0] Image added to PDF")

    pdf.save(`booking-${bookingData.bookingNumber}.pdf`)

    console.log("[v0] PDF downloaded successfully")

    document.body.removeChild(container)
  } catch (error) {
    console.error("[v0] Error downloading PDF:", error)
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`)
  }
}
