import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { countries } from "@/lib/countries"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        *,
        packages (
          id,
          billing_weight_kg,
          billing_weight_gm,
          gross_weight,
          length_cm,
          width_cm,
          height_cm,
          pieces,
          dimensional_weight,
          description
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      bookings: bookings || [],
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    console.log("[v0] Submitting form data:", formData)
    const supabase = await createClient()

    const { packages, ...bookingData } = formData

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
    ]

    for (const field of requiredFields) {
      if (!bookingData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    if (!packages || !Array.isArray(packages) || packages.length === 0) {
      return NextResponse.json({ error: "At least one package is required" }, { status: 400 })
    }

    // Validate country codes
    const validCountryCodes = countries.map((c) => c.code)
    if (
      !validCountryCodes.includes(bookingData.shipperCountry) ||
      !validCountryCodes.includes(bookingData.consigneeCountry)
    ) {
      return NextResponse.json({ error: "Invalid country code" }, { status: 400 })
    }

    let totalBillingWeightKg = 0
    let totalBillingWeightGm = 0
    let totalGrossWeight = 0
    let totalDimensionalWeight = 0
    let totalPieces = 0

    packages.forEach((pkg: any) => {
      totalBillingWeightKg += Number.parseFloat(pkg.billingWeightKg) || 0
      totalBillingWeightGm += Number.parseFloat(pkg.billingWeightGm) || 0
      totalGrossWeight += Number.parseFloat(pkg.grossWeight) || 0
      totalDimensionalWeight += pkg.dimensionalWeight || 0
      totalPieces += Number.parseInt(pkg.pieces) || 0
    })

    // First, get and increment the counter
    const { data: counterData, error: counterError } = await supabase
      .from("booking_sequence")
      .select("current_number")
      .eq("id", 1)
      .single()

    if (counterError) {
      console.error("[v0] Counter fetch error:", counterError)
      return NextResponse.json({ error: "Failed to generate booking number" }, { status: 500 })
    }

    const nextValue = (counterData?.current_number || 0) + 1

    // Update the counter
    const { error: updateError } = await supabase
      .from("booking_sequence")
      .update({
        current_number: nextValue,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1)

    if (updateError) {
      console.error("[v0] Counter update error:", updateError)
      return NextResponse.json({ error: "Failed to update booking counter" }, { status: 500 })
    }

    // Generate the booking number with KBT prefix and zero padding
    const bookingNumber = `101${nextValue.toString().padStart(6, "0")}`
    console.log("[v0] Generated booking number:", bookingNumber)

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        booking_number: bookingNumber,

        // Shipper Information
        shipper_company_name: bookingData.shipperCompanyName,
        shipper_contact_person: bookingData.shipperContactPerson,
        shipper_address_line: bookingData.shipperAddressLine,
        shipper_city: bookingData.shipperCity,
        shipper_zip: bookingData.shipperZip,
        shipper_state: bookingData.shipperState,
        shipper_country: bookingData.shipperCountry,
        shipper_phone: bookingData.shipperPhone,
        shipper_email: bookingData.shipperEmail,

        // Consignee Information
        consignee_company_name: bookingData.consigneeCompanyName,
        consignee_contact_person: bookingData.consigneeContactPerson,
        consignee_address_line: bookingData.consigneeAddressLine,
        consignee_city: bookingData.consigneeCity,
        consignee_zip: bookingData.consigneeZip,
        consignee_state: bookingData.consigneeState,
        consignee_country: bookingData.consigneeCountry,
        consignee_phone: bookingData.consigneePhone,
        consignee_email: bookingData.consigneeEmail,

        // Shipment Information
        payment_mode: bookingData.paymentMode,
        amount: bookingData.amount ? Number.parseFloat(bookingData.amount) : null,
        reference_number: bookingData.referenceNumber || null,
        pieces: Number.parseInt(bookingData.pieces),
        product_value: bookingData.productValue ? Number.parseFloat(bookingData.productValue) : null,
        billing_weight_kg: totalBillingWeightKg,
        billing_weight_gm: totalBillingWeightGm,
        gross_weight: totalGrossWeight,
        item_type: bookingData.itemType,
        remarks: bookingData.remarks || null,
        item_description: bookingData.itemDescription,

        length_cm: packages[0]?.lengthCm ? Number.parseFloat(packages[0].lengthCm) : null,
        width_cm: packages[0]?.widthCm ? Number.parseFloat(packages[0].widthCm) : null,
        height_cm: packages[0]?.heightCm ? Number.parseFloat(packages[0].heightCm) : null,
        dimensional_weight: totalDimensionalWeight,

        status: "Pending", // Set default status to 'Pending'
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    const packageInserts = packages.map((pkg: any) => ({
      booking_id: booking.id,
      billing_weight_kg: Number.parseFloat(pkg.billingWeightKg) || 0,
      billing_weight_gm: Number.parseFloat(pkg.billingWeightGm) || 0,
      gross_weight: Number.parseFloat(pkg.grossWeight) || 0,
      length_cm: Number.parseFloat(pkg.lengthCm) || 0,
      width_cm: Number.parseFloat(pkg.widthCm) || 0,
      height_cm: Number.parseFloat(pkg.heightCm) || 0,
      pieces: Number.parseInt(pkg.pieces) || 1,
      dimensional_weight: pkg.dimensionalWeight || 0,
      description: pkg.description || null,
    }))

    const { error: packagesError } = await supabase.from("packages").insert(packageInserts)

    if (packagesError) {
      console.error("[v0] Packages insert error:", packagesError)
      // Don't fail the entire booking if packages insert fails
      console.warn("[v0] Continuing without package details")
    }

    const { error: historyError } = await supabase.from("status_history").insert({
      booking_id: booking.id,
      status: "Pending",
      timestamp: new Date().toISOString(),
      notes: "Booking created",
    })

    if (historyError) {
      console.error("[v0] Status history insert error:", historyError)
      // Don't fail the booking if history insert fails
    }

    console.log("[v0] Booking created successfully:", booking)
    return NextResponse.json({
      success: true,
      booking: booking,
      message: "Booking created successfully",
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
