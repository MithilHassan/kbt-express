import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { bookingNumber } = await request.json()

    if (!bookingNumber) {
      return NextResponse.json({ error: "Booking number is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_number", bookingNumber.trim())
      .single()

    if (error || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Return only necessary tracking information
    return NextResponse.json({
      success: true,
      booking: {
        booking_number: booking.booking_number,
        status: booking.status,
        created_at: booking.created_at,
        updated_at: booking.updated_at,
        shipper_company_name: booking.shipper_company_name,
        shipper_city: booking.shipper_city,
        shipper_state: booking.shipper_state,
        shipper_country: booking.shipper_country,
        consignee_company_name: booking.consignee_company_name,
        consignee_city: booking.consignee_city,
        consignee_state: booking.consignee_state,
        consignee_country: booking.consignee_country,
        pieces: booking.pieces,
        gross_weight: booking.gross_weight,
        item_type: booking.item_type,
        payment_mode: booking.payment_mode,
      },
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
