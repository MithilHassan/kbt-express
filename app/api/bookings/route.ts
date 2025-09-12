import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { countries } from "@/lib/countries"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*")
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
    const supabase = await createClient()

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

    // Calculate dimensional weight if dimensions are provided
    let dimensionalWeight = null
    if (formData.lengthCm && formData.widthCm && formData.heightCm) {
      const length = Number.parseFloat(formData.lengthCm)
      const width = Number.parseFloat(formData.widthCm)
      const height = Number.parseFloat(formData.heightCm)
      dimensionalWeight = (length * width * height) / 5000
    }

    // Insert booking into database
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
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

        // Dimensions
        length_cm: formData.lengthCm ? Number.parseFloat(formData.lengthCm) : null,
        width_cm: formData.widthCm ? Number.parseFloat(formData.widthCm) : null,
        height_cm: formData.heightCm ? Number.parseFloat(formData.heightCm) : null,
        dimensional_weight: dimensionalWeight,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

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
