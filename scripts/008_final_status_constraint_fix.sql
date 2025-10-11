-- Final fix for status constraint issue
-- This script will definitely remove the old constraint and add the new one

-- Step 1: Drop the constraint (using IF EXISTS to avoid errors)
DO $$ 
BEGIN
    -- Try to drop the constraint if it exists
    ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
    RAISE NOTICE 'Dropped bookings_status_check constraint if it existed';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not drop constraint: %', SQLERRM;
END $$;

-- Step 2: Add the new constraint with all status values
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

-- Step 3: Update any existing records with old status values to new ones
UPDATE bookings 
SET status = CASE 
    WHEN status = 'pending' THEN 'Pending'
    WHEN status = 'confirmed' THEN 'Documentation Prepared'
    WHEN status = 'in_transit' THEN 'In Transit to Destination'
    WHEN status = 'delivered' THEN 'Delivered'
    WHEN status = 'cancelled' THEN 'Cancelled'
    ELSE status
END
WHERE status IN ('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled');

-- Verify the constraint was added
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'bookings'::regclass 
AND conname = 'bookings_status_check';
