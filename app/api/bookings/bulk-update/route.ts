import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(request: NextRequest) {
  try {
    const { bookingIds, status } = await request.json()
    console.log("[v0] Bulk status update request:", { bookingIds, status })

    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
      return NextResponse.json({ error: "No booking IDs provided" }, { status: 400 })
    }

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Validate status value
    const validStatuses = ["pending", "confirmed", "in_transit", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
    }

    const supabase = await createClient()

    // Update multiple bookings at once
    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: status,
        updated_at: new Date().toISOString(),
      })
      .in("id", bookingIds)
      .select("id, booking_number, status")

    if (error) {
      console.error("[v0] Bulk update database error:", error)
      return NextResponse.json({ error: "Failed to update bookings" }, { status: 500 })
    }

    console.log("[v0] Bulk update successful:", data)
    return NextResponse.json({
      success: true,
      updatedBookings: data,
      message: `Successfully updated ${data?.length || 0} bookings to ${status}`,
    })
  } catch (error) {
    console.error("[v0] Bulk update API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
