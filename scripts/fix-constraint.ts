import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixStatusConstraint() {
  console.log("[v0] Starting constraint fix...")

  try {
    // Drop the old constraint
    const dropConstraintSQL = `
      ALTER TABLE bookings 
      DROP CONSTRAINT IF EXISTS bookings_status_check;
    `

    console.log("[v0] Dropping old constraint...")
    const { error: dropError } = await supabase.rpc("exec_sql", {
      sql: dropConstraintSQL,
    })

    if (dropError) {
      console.error("[v0] Error dropping constraint:", dropError)
      console.log("[v0] Trying alternative method...")

      // Alternative: Use raw SQL query
      const { error: altError } = await supabase.from("bookings").select("*").limit(0) // Just to test connection

      console.log("[v0] Please run this SQL directly in Supabase SQL Editor:")
      console.log(`
-- Step 1: Drop the old constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- Step 2: Add the new constraint with all status values
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
CHECK (status IN (
  'Pending',
  'Documentation Prepared',
  'Shipment Finalised',
  'Pickup Arranged',
  'Arrived Hub (Origin)',
  'Sorted to Destination',
  'In Transit to Destination',
  'Arrived Depot (Destination)',
  'Released from Customs',
  'Delivered',
  'Cancelled'
));
      `)
      return
    }

    // Add the new constraint
    const addConstraintSQL = `
      ALTER TABLE bookings 
      ADD CONSTRAINT bookings_status_check 
      CHECK (status IN (
        'Pending',
        'Documentation Prepared',
        'Shipment Finalised',
        'Pickup Arranged',
        'Arrived Hub (Origin)',
        'Sorted to Destination',
        'In Transit to Destination',
        'Arrived Depot (Destination)',
        'Released from Customs',
        'Delivered',
        'Cancelled'
      ));
    `

    console.log("[v0] Adding new constraint...")
    const { error: addError } = await supabase.rpc("exec_sql", {
      sql: addConstraintSQL,
    })

    if (addError) {
      console.error("[v0] Error adding constraint:", addError)
      return
    }

    console.log("[v0] ✓ Constraint updated successfully!")
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    console.log("\n[v0] Please run this SQL manually in Supabase SQL Editor:")
    console.log(`
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
CHECK (status IN (
  'Pending',
  'Documentation Prepared',
  'Shipment Finalised',
  'Pickup Arranged',
  'Arrived Hub (Origin)',
  'Sorted to Destination',
  'In Transit to Destination',
  'Arrived Depot (Destination)',
  'Released from Customs',
  'Delivered',
  'Cancelled'
));
    `)
  }
}

fixStatusConstraint()
