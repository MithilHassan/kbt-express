import { type NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status, notes, createdBy } = await request.json()

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // Update the booking status
    const { data: updatedBooking, error: updateError } = await supabase
      .from("bookings")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, booking_number, status")
      .single()

    if (updateError) {
      console.error("Error updating booking status:", updateError)
      return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 })
    }

    // Add status history entry
    const historyData = {
      booking_id: id,
      status,
      timestamp: new Date().toISOString(),
      notes: notes || null,
      created_by: createdBy || null,
    }

    const { error: historyError } = await supabase.from("status_history").insert(historyData)

    if (historyError) {
      console.error("Error creating status history:", historyError)
      // Don't fail the request if history insert fails
    }

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      booking: updatedBooking,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get status history for the booking
    const { data: history, error } = await supabase
      .from("status_history")
      .select("*")
      .eq("booking_id", id)
      .order("timestamp", { ascending: true })

    if (error) {
      console.error("Error fetching status history:", error)
      return NextResponse.json({ error: "Failed to fetch status history" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      history: history || [],
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
