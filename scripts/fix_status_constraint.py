import os
from supabase import create_client

# Get Supabase credentials from environment
supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

if not supabase_url or not supabase_key:
    print("Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required")
    exit(1)

# Create Supabase client
supabase = create_client(supabase_url, supabase_key)

print("Fixing status constraint on bookings table...")

# SQL to drop the old constraint and create a new one with all status values
sql_commands = """
-- Drop the existing constraint
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- Add new constraint with all status values
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check 
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

-- Update any existing records with old status values to new ones
UPDATE public.bookings 
SET status = CASE 
  WHEN status = 'pending' THEN 'Pending'
  WHEN status = 'confirmed' THEN 'Documentation Prepared'
  WHEN status = 'in_transit' THEN 'In Transit to Destination'
  WHEN status = 'delivered' THEN 'Delivered'
  WHEN status = 'cancelled' THEN 'Cancelled'
  ELSE status
END
WHERE status IN ('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled');
"""

try:
    # Execute the SQL using Supabase's RPC or direct SQL execution
    result = supabase.rpc('exec_sql', {'sql': sql_commands}).execute()
    print("✓ Successfully updated status constraint!")
    print("✓ The bookings table now accepts all 11 status values")
except Exception as e:
    # If RPC doesn't work, try using postgrest directly
    print(f"Note: {str(e)}")
    print("\nPlease run the following SQL directly in your Supabase SQL Editor:")
    print("\n" + "="*60)
    print(sql_commands)
    print("="*60)
    print("\nSteps:")
    print("1. Go to your Supabase Dashboard")
    print("2. Navigate to SQL Editor")
    print("3. Copy and paste the SQL above")
    print("4. Click 'Run' to execute")
