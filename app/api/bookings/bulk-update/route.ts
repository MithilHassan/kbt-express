import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { STATUS_OPTIONS } from "@/lib/status-config"

export async function PATCH(request: NextRequest) {
  try {
    const { bookingIds, status, notes, createdBy } = await request.json()

    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
      return NextResponse.json({ error: "No booking IDs provided" }, { status: 400 })
    }

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const validStatuses = STATUS_OPTIONS.map((option) => option.value)
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Update multiple bookings at once
    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: status,
        updated_at: new Date().toISOString(),
      })
      .in("id", bookingIds)
      .select()

    if (error) {
      console.error("[v0] Bulk update database error:", error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "No bookings were updated. Please check if the booking IDs exist." },
        { status: 404 },
      )
    }

    // Create status history entries for each updated booking
    if (data && data.length > 0) {
      const statusHistoryEntries = data.map((booking) => ({
        booking_id: booking.id,
        status: status,
        timestamp: new Date().toISOString(),
        notes: notes || null,
        created_by: createdBy || "System",
      }))

      const { error: historyError } = await supabase.from("status_history").insert(statusHistoryEntries)

      if (historyError) {
        console.error("[v0] Failed to create status history entries:", historyError)
      }
    }

    return NextResponse.json({
      success: true,
      updatedBookings: data,
      count: data.length,
      message: `Successfully updated ${data.length} booking(s) to ${status}`,
    })
  } catch (error) {
    console.error("[v0] Bulk update API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
