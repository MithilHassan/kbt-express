import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get total bookings count
    const { count: totalBookings, error: totalError } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })

    if (totalError) {
      console.error(" Error fetching total bookings:", totalError)
    }

    // Get today's bookings count
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { count: todayBookings, error: todayError } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString())
      .lt("created_at", tomorrow.toISOString())

    if (todayError) {
      console.error(" Error fetching today's bookings:", todayError)
    }

    // Get pending bookings count
    const { count: pendingBookings, error: pendingError } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending")

    if (pendingError) {
      console.error(" Error fetching pending bookings:", pendingError)
    }

    // Get completed bookings count
    const { count: completedBookings, error: completedError } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "Delivered")

    if (completedError) {
      console.error(" Error fetching completed bookings:", completedError)
    }

    return NextResponse.json({
      success: true,
      totalBookings: totalBookings || 0,
      todayBookings: todayBookings || 0,
      pendingBookings: pendingBookings || 0,
      completedBookings: completedBookings || 0,
    })
  } catch (error) {
    console.error(" API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
