import { type NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { countries } from "@/lib/countries"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const { data: booking, error } = await supabase.from("bookings").select("*").eq("id", params.id).single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      booking: booking,
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.json()
    console.log("[v0] Updating booking:", params.id, formData)

    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const { data: existingBooking, error: fetchError } = await supabase
      .from("bookings")
      .select("id")
      .eq("id", params.id)
      .single()

    console.log("[v0] Existing booking check:", existingBooking, "Fetch error:", fetchError)

    if (fetchError || !existingBooking) {
      console.error("[v0] Booking not found:", params.id)
      return NextResponse.json({ error: `Booking with ID ${params.id} not found` }, { status: 404 })
    }

    // Validate required fields
    const requiredFields = [
      "shipperCompanyName",
      "shipperContactPerson",
      "shipperAddressLine",
      "shipperCity",
      "shipperZip",
      "shipperState",
      "shipperCountry",
      "shipperPhone",
      "shipperEmail",
      "consigneeCompanyName",
      "consigneeContactPerson",
      "consigneeAddressLine",
      "consigneeCity",
      "consigneeZip",
      "consigneeState",
      "consigneeCountry",
      "consigneePhone",
      "consigneeEmail",
      "paymentMode",
      "pieces",
      "itemType",
      "itemDescription",
      "status",
    ]

    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate country codes
    const validCountryCodes = countries.map((c) => c.code)
    if (
      !validCountryCodes.includes(formData.shipperCountry) ||
      !validCountryCodes.includes(formData.consigneeCountry)
    ) {
      return NextResponse.json({ error: "Invalid country code" }, { status: 400 })
    }

    // Validate status
    const validStatuses = ["pending", "confirmed", "in_transit", "delivered", "cancelled"]
    if (!validStatuses.includes(formData.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Calculate dimensional weight if dimensions are provided
    let dimensionalWeight = null
    if (formData.lengthCm && formData.widthCm && formData.heightCm) {
      const length = Number.parseFloat(formData.lengthCm)
      const width = Number.parseFloat(formData.widthCm)
      const height = Number.parseFloat(formData.heightCm)
      dimensionalWeight = (length * width * height) / 5000
    }

    // Update booking in database without selecting
    const updateData = {
      // Shipper Information
      shipper_company_name: formData.shipperCompanyName,
      shipper_contact_person: formData.shipperContactPerson,
      shipper_address_line: formData.shipperAddressLine,
      shipper_city: formData.shipperCity,
      shipper_zip: formData.shipperZip,
      shipper_state: formData.shipperState,
      shipper_country: formData.shipperCountry,
      shipper_phone: formData.shipperPhone,
      shipper_email: formData.shipperEmail,

      // Consignee Information
      consignee_company_name: formData.consigneeCompanyName,
      consignee_contact_person: formData.consigneeContactPerson,
      consignee_address_line: formData.consigneeAddressLine,
      consignee_city: formData.consigneeCity,
      consignee_zip: formData.consigneeZip,
      consignee_state: formData.consigneeState,
      consignee_country: formData.consigneeCountry,
      consignee_phone: formData.consigneePhone,
      consignee_email: formData.consigneeEmail,

      // Shipment Information
      payment_mode: formData.paymentMode,
      amount: formData.amount ? Number.parseFloat(formData.amount) : null,
      reference_number: formData.referenceNumber || null,
      pieces: Number.parseInt(formData.pieces),
      product_value: formData.productValue ? Number.parseFloat(formData.productValue) : null,
      billing_weight_kg: formData.billingWeightKg ? Number.parseFloat(formData.billingWeightKg) : null,
      billing_weight_gm: formData.billingWeightGm ? Number.parseFloat(formData.billingWeightGm) : null,
      gross_weight: formData.grossWeight ? Number.parseFloat(formData.grossWeight) : null,
      item_type: formData.itemType,
      remarks: formData.remarks || null,
      item_description: formData.itemDescription,
      status: formData.status,

      // Dimensions
      length_cm: formData.lengthCm ? Number.parseFloat(formData.lengthCm) : null,
      width_cm: formData.widthCm ? Number.parseFloat(formData.widthCm) : null,
      height_cm: formData.heightCm ? Number.parseFloat(formData.heightCm) : null,
      dimensional_weight: dimensionalWeight,
      updated_at: new Date().toISOString(),
    }

    console.log("[v0] Update data being sent:", updateData)
    console.log("[v0] Booking ID for update:", params.id)

    const { data: updateResult, error: updateError } = await adminSupabase
      .from("bookings")
      .update(updateData)
      .eq("id", params.id)
      .select()

    console.log("[v0] Update result:", updateResult, "Update error:", updateError)

    if (updateError) {
      console.error("[v0] Database error:", updateError)
      return NextResponse.json({ error: `Database error: ${updateError.message}` }, { status: 500 })
    }

    if (!updateResult || updateResult.length === 0) {
      const { data: recheckBooking, error: recheckError } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", params.id)
        .single()

      console.log("[v0] Recheck booking after failed update:", recheckBooking, "Recheck error:", recheckError)

      return NextResponse.json(
        {
          error:
            "Update failed - no rows affected. Booking may have been deleted or RLS policies may be blocking the update.",
          debug: {
            bookingExists: !!recheckBooking,
            recheckError: recheckError?.message,
          },
        },
        { status: 500 },
      )
    }

    const updatedBooking = updateResult[0]
    console.log("[v0] Booking updated successfully:", updatedBooking)

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: "Booking updated successfully",
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminSupabase = createAdminClient()

    const { error } = await adminSupabase.from("bookings").delete().eq("id", params.id)

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.json()
    console.log("[v0] Updating booking status:", params.id, formData)

    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    // Check if booking exists
    const { data: existingBooking, error: fetchError } = await supabase
      .from("bookings")
      .select("id")
      .eq("id", params.id)
      .single()

    if (fetchError || !existingBooking) {
      console.error("[v0] Booking not found:", params.id)
      return NextResponse.json({ error: `Booking with ID ${params.id} not found` }, { status: 404 })
    }

    // Validate status field only
    if (!formData.status) {
      return NextResponse.json({ error: "Missing required field: status" }, { status: 400 })
    }

    const validStatuses = ["pending", "confirmed", "in_transit", "delivered", "cancelled"]
    if (!validStatuses.includes(formData.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update only the status field
    const { data: updateResult, error: updateError } = await adminSupabase
      .from("bookings")
      .update({
        status: formData.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()

    if (updateError) {
      console.error("[v0] Database error:", updateError)
      return NextResponse.json({ error: `Database error: ${updateError.message}` }, { status: 500 })
    }

    if (!updateResult || updateResult.length === 0) {
      return NextResponse.json({ error: "Update failed - no rows affected" }, { status: 500 })
    }

    const updatedBooking = updateResult[0]
    console.log("[v0] Booking status updated successfully:", updatedBooking)

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: "Booking status updated successfully",
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
