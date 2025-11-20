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
  shipperRegistrationType?: string
  shipperRegistrationNumber?: string
  consigneeCompanyName: string
  consigneeContactPerson: string
  consigneeAddressLine: string
  consigneeCity: string
  consigneeZip: string
  consigneeState: string
  consigneeCountry: string
  consigneePhone: string
  consigneeEmail: string
  consigneeRegistrationType?: string
  consigneeRegistrationNumber?: string
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

  const totalVolumetricWeight = bookingData.packages?.reduce((total, pkg) => {
  const volumetricPerPiece = (pkg.lengthCm * pkg.widthCm * pkg.heightCm) / 5000
  return total + volumetricPerPiece * pkg.pieces
  }, 0) ?? 0

  const generateDimensionRows = () => {
    if (bookingData.packages && bookingData.packages.length > 0) {
      // Display packages in pairs (2 per row)
      const rows: string[] = []
      for (let i = 0; i < bookingData.packages.length; i += 2) {
        const pkg1 = bookingData.packages[i]
        const pkg2 = bookingData.packages[i + 1]

        rows.push(`
          <tr>
            <td>${pkg1.lengthCm}</td>
            <td>${pkg1.widthCm}</td>
            <td>${pkg1.heightCm}</td>
            <td>${pkg1.pieces}</td>
            ${
              pkg2
                ? `
              <td>${pkg2.lengthCm}</td>
              <td>${pkg2.widthCm}</td>
              <td>${pkg2.heightCm}</td>
              <td>${pkg2.pieces}</td>
            `
                : `
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            `
            }
          </tr>
        `)
      }
      return rows.join("")
    } else {
      // Fallback to single dimension if no packages
      return `
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
      `
    }
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          /* --- Reset but preserve structure --- */
          @page { size: A4; margin: 0; }
          html, body, div { margin: 0; padding: 0; }
          * {
            box-sizing: border-box;
          }
          body { 
            font-family: Arial, sans-serif; 
            font-size: 10px;
            color: #000;
            background: #fff;
          }
          .invoice-container {
            padding: 15px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .barcode-section {
            text-align: right;
          }
          .barcode-container {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }
          .tracking-number {
            font-family: 'Courier New', monospace;
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 2px;
            transform: translateY(-10px);
          }
          .info-row {
            display: flex;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .section-header {
            background: #0253A3;
            color: #fff;
            font-weight: bold;
            padding-bottom: 3px;
            padding-left: 3px;
            text-transform: uppercase;
            font-size: 10px;
          }
          .reset-margin {
            transform: translateY(-5px);
          }
          .col {
            border: 3px solid #0253A3;
            padding: 1px;
            flex: 1;
          }
          .col:last-child {
            border-right: none;
          }
          .col-narrow {
            flex: 0.8;
            border-left: 3px solid #0253A3;
            border-right: 3px solid #0253A3;

          }
          .col-wide {
            flex: 1.5;
            border-left: 3px solid #0253A3;
          }
          .field-label {
            color: #000;
            text-transform: uppercase;
            transform: translateY(-5px);

          }
          .field-value {
            color: #000;
            line-height: 1.4;
            transform: translateY(-5px);
            font-weight: bold;

          }
          .field-group {
            border: 2px solid #0253A3;
            padding: 3px;
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
          }
          .table th {
            background: #0253A350;
            text-align: center;
            font-weight: bold;
            border: 1px solid #0253A3;
            padding-bottom: 5px;
          }
          .table td {
            text-align: center;
            border: 1px solid #0253A3;
            font-size: 10px;
            padding-bottom: 5px;
            font-weight: bold;
          }
          .signature-box {
            min-height: 60px;
            border: 1px solid #0253A3;
            margin-top: 5px;
            background: #fafafa;
          }
          .footer {
            background: #0253A3;
            color: #fff;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            padding: 5px;
            padding-top: 0px;
          }
          .declaration-text {
            line-height: 1.5;
            color: #000;
          }
          .commercial-invoice-container {
            padding: 40px;
            margin-top: 20px;
            font-size: 10px;
          }
          .ci-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 15px;
            border-bottom: 2px solid #333;
            margin-bottom: 15px;
          }
          .ci-title {
            font-size: 18px;
            font-weight: bold;
            color: #000;
          }
          .ci-barcode-section {
            text-align: right;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }
          .ci-barcode-number {
            font-family: 'Courier New', monospace;
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 1px;
            transform: translateY(-10px);
          }
          .ci-info-row {
            display: flex;
            gap: 30px;
            align-items: center;
          }
          .ci-left-col, .ci-right-col {
            flex: 1;
            padding: 10px;
            padding-bottom:0px;
          }
          .ci-field-group {
            margin-bottom: 8px;
            display: flex;
          }
          .ci-field-label {
            font-weight: bold;
            font-size: 10px;
            margin-bottom: 2px;
            flex: 1;
          }
          .ci-label {
            font-weight: bold;
            font-size: 9px;
            flex: 1;
          }
          .ci-value {
            font-size: 10px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
            flex: 2;
            color: #333;
          }
          .ci-section-row {
            display: flex;
            gap: 30px;
          }
          .ci-shipper-section,
          .ci-consignee-section {
            flex: 1;
            padding: 10px;
          }
          .ci-section-title {
            font-weight: bold;
            font-size: 10px;
            background: #ddd;
            padding: 5px;
            margin-bottom: 10px;
            text-align: center;
          }
          .ci-field-row {
            display: flex;
            gap: 15px;
            margin-bottom: 8px;
          }
          .ci-field-row .ci-field-group {
            flex: 1;
            margin-bottom: 0;
          }
          .ci-details {
            border: 1px solid #ccc;
            padding: 10px;
            margin-bottom: 15px;
          }
          .ci-goods-table {
            margin-bottom: 15px;
          }
          .ci-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
          }
          .ci-table th,
          .ci-table td {
            border: 1px solid #999;
            padding: 8px;
            text-align: left;
            font-size: 9px;
          }
          .ci-table th {
            font-weight: bold;
          }
          .ci-total {
            text-align: right;
            margin-bottom: 15px;
          }
          .ci-total-label {
            font-weight: bold;
            font-size: 10px;
            display: inline-block;
            margin-right: 15px;
          }
          .ci-total-value {
            font-weight: bold;
            font-size: 12px;
            display: inline-block;
            border: 2px solid #333;
            width: 150px;
            padding: 10px;
            padding-top: 0px;
            text-align: left;
            color: #333;
          }
          .ci-declaration {
            margin: 15px 0px 15px 0px;
            font-size: 9px;
            line-height: 1.5;
            color: #333;
          }
          .content { 
            padding: 10px;
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
              <div class="section-header"><p class="reset-margin">Shipper Name and Address</p></div>
              <div style="padding: 3px;">
                <div class="field-group" style="border-bottom: 0">
                  <div class="field-value">${bookingData.shipperCompanyName}</div>
                  <div class="field-value">${bookingData.shipperAddressLine}</div>
                </div>
                <div class="inline-fields">
                  <div class="field-group" style="border-bottom: 0;border-right: 0">
                    <div class="field-label ">Postal/Zip Code</div>
                    <div class="field-value ">${bookingData.shipperZip}</div>
                  </div>
                  <div class="field-group" style="border-bottom: 0;">
                  <div class="field-label ">Telephone</div>
                    <div class="field-value ">${bookingData.shipperPhone}</div>
                  </div>
                </div>
                <div class="inline-fields">
                  <div class="field-group" style="border-right: 0">
                    <div class="field-label ">Contact Person</div>
                    <div class="field-value ">${bookingData.shipperContactPerson}</div>
                  </div>
                  <div class="field-group">
                    <div class="field-label ">Email Id</div>
                    <div class="field-value ">${bookingData.shipperEmail}</div>
                  </div>
                </div>

                ${
                  bookingData.shipperRegistrationType
                    ? `
                <div>
                  <div class="field-group" style="display: flex; align-items: center; border-top: 0">
                    <div class="field-label ">${bookingData.shipperRegistrationType}:</div>
                    <div class="field-value ">${bookingData.shipperRegistrationNumber || ""}</div>
                  </div>
                </div>
                `
                    : ""
                }
              </div>

              <!-- Consignee  --> 

                
              <div class="section-header"><p class="reset-margin">Consignee Name and Address</p></div>
              <div style="padding: 3px;">
                <div class="field-group" style="border-bottom: 0;">
                  <div class="field-value">${bookingData.consigneeCompanyName}</div>
                  <div class="field-value">${bookingData.consigneeAddressLine}</div>
                </div>
                <div class="inline-fields">
                  <div class="field-group" style="border-bottom: 0; border-right: 0;">
                    <div class="field-label">Postal/Zip Code</div>
                    <div class="field-value">${bookingData.consigneeZip}</div>
                  </div>
                  <div class="field-group" style="border-bottom: 0;">
                    <div class="field-label">Telephone</div>
                    <div class="field-value">${bookingData.consigneePhone}</div>
                  </div>
                </div>
                <div class="inline-fields">
                  <div class="field-group" style="border-right: 0;">
                    <div class="field-label">Contact Person</div>
                    <div class="field-value">${bookingData.consigneeContactPerson}</div>
                  </div>
                  <div class="field-group">
                    <div class="field-label">Email Id</div>
                    <div class="field-value">${bookingData.consigneeEmail}</div>
                  </div>
                </div>
                ${
                  bookingData.consigneeRegistrationType
                    ? `
                <div>
                  <div class="field-group" style="display: flex; align-items: center; border-top: 0;">
                    <div class="field-label">${bookingData.consigneeRegistrationType}:</div>
                    <div class="field-value">${bookingData.consigneeRegistrationNumber || ""}</div>
                  </div>
                </div>
                `
                    : ""
                }
              </div>
              <!-- Delivery Address  --> 

              <div class="section-header"><p class="reset-margin">Delivery Name and Address</p></div>
              <div style="padding: 3px;">
                <div class="field-group" style="border-bottom: 0;">
                  <div class="field-value" style="font-weight: bold;">${bookingData.consigneeCompanyName}</div>
                  <div class="field-value">${bookingData.consigneeAddressLine}, ${bookingData.consigneeCity}, ${bookingData.consigneeState}, ${bookingData.consigneeCountry}</div>
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
                <div style="flex: 1; border-right: 5px solid #0253A3;">
                  <div class="section-header" style="text-align: center;"> <p class="reset-margin">Origin</p></div>
                  <div style="padding: 3px;">
                    <div class="field-group">
                      <div class="field-value" style="font-weight: bold; text-align: center; padding: 3px;" >${bookingData.shipperCountry}</div>
                    </div>
                  </div>
                </div>
                <div style="flex: 1;">
                  <div class="section-header" style="text-align: center;"> <p class="reset-margin">Destination</p></div>
                  <div style="padding: 3px;">
                    <div class="field-group">
                      <div class="field-value" style="font-weight: bold; text-align: center; padding: 3px;">${bookingData.consigneeCountry}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="section-header"><p class="reset-margin">Consignment (Shipment) Details</p></div>
              <div style="padding: 3px;">
                <div class="inline-fields">
                  <div class="field-group" style= "display: flex; align-items: center; border-bottom: 0; border-right: 0;">
                    <div class="field-label">Number of Package :</div>
                    <div class="field-value" style="margin-left: 5px;">${bookingData.pieces}</div>
                  </div>
                  <div class="field-group" style="display: flex; align-items: center; border-bottom: 0;">
                    <div class="field-label">A.Weight (KG) :</div>
                    <div class="field-value" style="margin-left: 5px;">${bookingData.billingWeightKg}</div>
                  </div>
                </div>
                <div class="field-group" style= "display: flex; align-items: center; border-bottom: 0;">
                  <div class="field-label">Vol Weight (KG) :</div>
                  <div class="field-value" style="margin-left: 5px;">${totalVolumetricWeight}</div>
                </div>
                <div class="field-group" style= "display: flex; align-items: center; border-bottom: 0;">
                  <div class="field-label">Value for Customs (USD) :</div>
                  <div class="field-value" style="margin-left: 5px;">${bookingData.productValue || "N/A"}</div>
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

              <div class="section-header"><p class="reset-margin">Description of Goods</p></div>
              <div style="padding: 3px">
              <div style="padding: 3px; min-height: 60px; border: 2px solid #0253A3;">
                <div class="field-value">${bookingData.itemDescription}</div>
              </div>
              </div>
              <div class="section-header"><p class="reset-margin">Dimension in CM (Volume Ratio 5000)</p></div>
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
                    ${generateDimensionRows()}
                    <tr>
                      <td colspan="4" style="text-align: left; font-weight: regular;">
                        Volumetric Weight (each calculated by L×W×H/5000)
                      </td>
                      <td colspan="4" style="text-align: right; font-weight: bold;">
                        = TOTAL VOLUMETRIC WEIGHT: ${totalVolumetricWeight.toFixed(2)} KG
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Signature Section    --> 

              <div style="padding: 5px; display:grid; gap:10px;">
                <div class="field-label">Received in Good Condition By Consignee.</div>
                <div class="field-label">SIGNATURE: _________________</div>
                <div class="inline-fields">
                    <div class="field-label">DATE: _________________</div>
                    <div class="field-label">TIME: _________________</div>
                </div>
              </div>
            </div>

              <!-- Right Column  --> 

             
            <div class="col-narrow">
              <div class="section-header" style="text-align: center;"> <p class="reset-margin">Booking Date</p></div>
              <div style="padding: 3px;">
                <div class="field-group">
                  <div class="field-value" style="font-weight: bold; text-align: center; padding: 3px;">${new Date(bookingData.createdAt).toLocaleDateString("en-GB")}</div>
                </div>
              </div>
              <div class="section-header" style="text-align: center;"> <p class="reset-margin">Service Mode</p></div>
              <div style="padding: 3px;">
                <div class="field-group">
                  <div class="field-value" style="font-weight: bold; text-align: center; padding: 3px;">EXPRESS</div>
                </div>
              </div>

              <div class="section-header" style="text-align: center;"> <p class="reset-margin">Shipment Type</p></div>
              <div style="padding: 3px;">
                <div class="field-group">
                  <div class="field-value" style="font-weight: bold; text-align: center; padding: 3px;">
                    ${bookingData.itemType}
                  </div>
                </div>
              </div> 
              <div class="section-header"><p class="reset-margin">Shipper Declaration</p></div>
              <div style="padding: 3px;">
                <div class="declaration-text reset-margin">
                  non-negotiate consignment note subject to standard conditions of carriage shown on reverse side.
                  <br/>
                  the carriage specifically limits its liability to USD100.00 per consignment for any cause
                </div>
                <div class="field-label" style="margin: 10px 0px;">SHIPPER's SIGNATURE:______________________</div>
                <div class="field-label">DATE:__________________________</div>
              </div>

              <!-- Reference Number  --> 

                
              <div class="section-header" style="text-align: center;"> <p class="reset-margin">Reference Number</p></div>
              <div style="padding: 3px;">
                <div class="field-group">
                  <div class="field-value" style="font-weight: bold; text-align: center; padding: 3px;">
                    ${bookingData.referenceNumber || bookingData.bookingNumber}
                  </div>
                </div>
              </div>

              <div class="section-header" style="text-align: center;"> <p class="reset-margin">Picked up/ Delivery by</p></div>
              <div style="padding: 3px;">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="height: 25px">
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
                </div>
            </div>
          </div>

          <!-- Footer  --> 
            
          <div class="footer">
            <a class="reset-margin" href="www.kbtexpress.net">www.kbtexpress.net</a>
            <p class="reset-margin">Email: support@kbtexpress.net</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function generateCommercialInvoiceHTML(bookingData: BookingData): string {
  const invoiceNumber = `AIN-${bookingData.bookingNumber}`
  const trackingNumber = bookingData.bookingNumber.replace(/[^A-Z0-9]/g, "").toUpperCase()

  const formattedDate = new Date(bookingData.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return `
    <div class="page-break"></div>
    <div class="commercial-invoice-container">
      <div class="ci-header">
        <div class="ci-title">Commercial Invoice</div>
        <div class="ci-barcode-section">
            <svg id="barcode-ci-${trackingNumber}" class="ci-barcode-image"></svg>
            <div class="ci-barcode-number">${trackingNumber}</div>
          </div>
      </div>



      <div class="ci-info-row">
        <div class="ci-left-col">
          <div class="ci-field-group">
            <label class="ci-field-label">Date:</label>
            <div class="ci-value" style="border: none;">${formattedDate}</div>
          </div>
        </div>
        <div class="ci-right-col">
          
        </div>
      </div>

      <div class="ci-content">
        <div class="ci-section-row">
          <div class="ci-shipper-section">
            <div style="font-weight: bold; margin-bottom: 10px;">SHIPPER</div>
            <div class="ci-field-group">
              <div class="ci-label">Company Name:</div>
              <div class="ci-value">${bookingData.shipperCompanyName}</div>
            </div>
            <div class="ci-field-group">
              <div class="ci-label">Address:</div>
              <div class="ci-value">${bookingData.shipperAddressLine}</div>
            </div>
            <div class="ci-field-group">
              <div class="ci-label">Town/Area Code:</div>
              <div class="ci-value">${bookingData.shipperCity}</div>
            </div>
            <div class="ci-field-group">
              <div class="ci-label">State/Country:</div>
              <div class="ci-value">${bookingData.shipperState}, ${bookingData.shipperCountry}</div>
            </div>
            <div class="ci-field-group">
              <div class="ci-label">Contact Name:</div>
              <div class="ci-value">${bookingData.shipperContactPerson}</div>
            </div>
            <div class="ci-field-group">
              <div class="ci-label">Phone/Fax No:</div>
              <div class="ci-value">${bookingData.shipperPhone}</div>
            </div>
            <div class="ci-field-group">
              <div class="ci-label">Consignment No:</div>
              <div class="ci-value">${bookingData.referenceNumber || bookingData.bookingNumber}</div>
            </div>
            <div class="ci-field-group">
              <div class="ci-label">No. of Pkg:</div>
              <div class="ci-value">${bookingData.pieces}</div>
            </div>
            <div class="ci-field-group">
              <div class="ci-label">Total Weight:</div>
              <div class="ci-value">${bookingData.billingWeightKg} KG</div>
            </div>
            <div class="ci-field-group">
              <div class="ci-label">Dimensions(LxWxH):</div>
              <div class="ci-value">${bookingData.lengthCm}x${bookingData.widthCm}x${bookingData.heightCm} cm</div>
            </div>
            <div class="ci-field-group">
              <div class="ci-label">Shipment Terms:</div>
              <div class="ci-value">${bookingData.paymentMode === "prepaid" ? "DDU" : "DAP"}</div>
            </div>
          </div>

          <div class="ci-consignee-section">
            <div style="font-weight: bold; margin-bottom: 10px;">CONSIGNEE</div>
            <div class="ci-field-group">
              <div class="ci-label">Company Name:</div>
              <div class="ci-value">${bookingData.consigneeCompanyName}</div>
            </div>
            <div class="ci-field-group">
              <div class="ci-label">Address:</div>
              <div class="ci-value">${bookingData.consigneeAddressLine}</div>
            </div>
            <div class="ci-field-group">
              <div class="ci-label">Town/Area Code:</div>
              <div class="ci-value">${bookingData.consigneeCity}</div>
            </div>
            <div class="ci-field-group">
              <div class="ci-label">State/Country:</div>
              <div class="ci-value">${bookingData.consigneeState}, ${bookingData.consigneeCountry}</div>
            </div>
            <div class="ci-field-group">
              <div class="ci-label">Contact Name:</div>
              <div class="ci-value">${bookingData.consigneeContactPerson}</div>
            </div>
            <div class="ci-field-group">
              <div class="ci-label">Phone/Fax No:</div>
              <div class="ci-value">${bookingData.consigneePhone}</div>
            </div>
            <div class="ci-field-group">
              <div class="ci-label">Email:</div>
                <div class="ci-value">${bookingData.consigneeEmail}</div>
            </div>
          </div>
        </div>

        <div class="ci-goods-table">
          <table class="ci-table">
            <thead>
              <tr>
                <th  style="text-align: center; width: 70%;"><h4 class="reset-margin">DESCRIPTION</h4></th>
                <th  style="text-align: center;"><h4 class="reset-margin">QTY</h4></th>
                <th  style="text-align: center;"><h4 class="reset-margin">CUSTOMS VALUE</h4></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="width: 70%; height: 100px; vertical-align: top;">${bookingData.itemDescription}</td>
                <td style="text-align: center; vertical-align: top;">${bookingData.pieces}</td>
                <td style="text-align: center; vertical-align: top;">${bookingData.productValue || "0.00"} USD</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="ci-total">
          <div class="ci-total-label">Total Invoice Value</div>
          <div class="ci-total-value">USD ${bookingData.productValue || "0.00"}</div>
        </div>

        <div style="display: flex; gap: 10px;">
          <div style="width: max-content; white-space: nowrap; color: #333;">Reason For Export</div>
          <div style="border-bottom: 1px solid #999; min-height: 10px; margin-top: 5px; width: 100%;"></div>
        </div>

        <div class="ci-declaration">
          <p>I declare that the information is true and correct to the best of my knowledge and the goods are of ${bookingData.shipperCountry} origin.</p>
          <p style="margin-top: 10px;">We, ${bookingData.shipperCompanyName} certify the particulars and quantity of the goods specified in this document are the goods which are submitted for clearance for export out of ${bookingData.shipperCountry}.</p>
        </div>

        <div style="width: 200px; color: #333; border-top: 1px solid #999; margin-top: 50px;">Designation of Authorised Signatory</div>
      
        <div style="width: 200px; color: #333; border-top: 1px solid #999; margin-top: 50px;">Signature / Stamp</div>

      </div>
    </div>
  `
}

import { getBase64Logo } from "./getBase64Logo" // adjust the path accordingly

export async function downloadBookingPDF(bookingData: BookingData) {
  try {
    console.log("[v0] Starting PDF generation...")

    const jsPDF = (await import("jspdf")).default
    const html2canvas = (await import("html2canvas")).default
    const JsBarcode = (await import("jsbarcode")).default
    const logoBase64 = await getBase64Logo()

    // === 1️⃣ Create temporary containers ===
    const container = document.createElement("div")
    const commercialContainer = document.createElement("div")

    container.innerHTML = generateBookingHTML(bookingData, logoBase64)
    commercialContainer.innerHTML = generateCommercialInvoiceHTML(bookingData)

    for (const el of [container, commercialContainer]) {
      // Keep the element visible to the layout engine but move it far off-screen
      // using a transform so html2canvas can render it. Avoid visibility:hidden
      // or opacity:0 because those make the rendered canvas blank.
      el.style.position = "fixed"
      el.style.left = "0"
      el.style.top = "0"
      el.style.transform = "translateX(-10000px)"
      el.style.zIndex = "-9999"
      el.style.width = "210mm"
      el.style.height = "auto"
      el.style.background = "white"
      el.style.margin = "0"
      el.style.padding = "0" // ✅ remove padding that adds extra width
      el.style.boxSizing = "border-box"
      // Ensure it's still visible to the renderer
      el.style.visibility = "visible"
      document.body.appendChild(el)
    }

    console.log("[v0] Containers created")

    // === 2️⃣ Generate barcodes BEFORE rendering ===
    const trackingNumber = bookingData.bookingNumber.replace(/[^A-Z0-9]/g, "").toUpperCase()

    const barcodeElement = container.querySelector(`#barcode-${trackingNumber}`)
    const ciBarcodeElement = commercialContainer.querySelector(`#barcode-ci-${trackingNumber}`)

    const barcodeOptions = {
      format: "CODE128",
      width: 2,
      height: 50,
      displayValue: false,
      margin: 0,
    }

    if (barcodeElement) JsBarcode(barcodeElement, trackingNumber, barcodeOptions)
    if (ciBarcodeElement)
      JsBarcode(ciBarcodeElement, trackingNumber, { ...barcodeOptions, height: 40 })

    // ✅ Wait briefly to ensure barcode SVGs fully render
    await new Promise((res) => setTimeout(res, 300))

    console.log("[v0] Barcodes rendered")

    // === 3️⃣ Capture both sections ===
    const captureOptions = {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    }

    const mainCanvas = await html2canvas(container, captureOptions)
    const commercialCanvas = await html2canvas(commercialContainer, captureOptions)

    console.log("[v0] Canvases captured")
    // Debug: log canvas dimensions to help diagnose blank pages
    try {
      console.log("[v0] mainCanvas size:", mainCanvas.width, "x", mainCanvas.height)
      console.log("[v0] commercialCanvas size:", commercialCanvas.width, "x", commercialCanvas.height)
      if (!mainCanvas.width || !mainCanvas.height) console.warn("[v0] mainCanvas appears empty")
      if (!commercialCanvas.width || !commercialCanvas.height)
        console.warn("[v0] commercialCanvas appears empty")
    } catch (e) {
      console.warn("[v0] Error logging canvas sizes:", e)
    }

    // === 4️⃣ Generate PDF ===
  const imgWidth = 210 // mm (A4 width)
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

  // Small bleed values (mm) to ensure images reach page edges in viewers
  const bleed = 1 // total extra mm added to width/height
  const halfBleed = bleed / 2

  const mainHeight = (mainCanvas.height * imgWidth) / mainCanvas.width
  const mainImgData = mainCanvas.toDataURL("image/png")
  // Draw slightly oversized so the image bleeds past the page edge by halfBleed on each side
  pdf.addImage(mainImgData, "PNG", -halfBleed, -halfBleed, imgWidth + bleed, mainHeight + bleed)

  pdf.addPage()
  const commercialHeight = (commercialCanvas.height * imgWidth) / commercialCanvas.width
  const commercialImgData = commercialCanvas.toDataURL("image/png")
  pdf.addImage(commercialImgData, "PNG", -halfBleed, -halfBleed, imgWidth + bleed, commercialHeight + bleed)

    // === 5️⃣ Download ===
    pdf.save(`booking-${bookingData.bookingNumber}.pdf`)

    console.log("[v0] PDF saved")

    // Clean up
    document.body.removeChild(container)
    document.body.removeChild(commercialContainer)
  } catch (error) {
    console.error("[v0] Error generating PDF:", error)
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}
