import { type NextRequest, NextResponse } from "next/server"
import { generateBookingPDF, type BookingData } from "@/lib/pdf-generator"

export async function POST(request: NextRequest) {
  try {
    const bookingData: BookingData = await request.json()

    // Generate PDF
    const doc = generateBookingPDF(bookingData)
    const pdfBuffer = doc.output("arraybuffer")

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="booking-${bookingData.bookingNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error("[v0] Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
