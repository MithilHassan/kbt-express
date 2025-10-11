-- First, find and drop ALL check constraints on the status column
DO $$ 
DECLARE
    constraint_name text;
BEGIN
    -- Find all check constraints on the bookings table that reference the status column
    FOR constraint_name IN 
        SELECT con.conname
        FROM pg_constraint con
        INNER JOIN pg_class rel ON rel.oid = con.conrelid
        INNER JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
        WHERE nsp.nspname = 'public'
        AND rel.relname = 'bookings'
        AND con.contype = 'c'
        AND pg_get_constraintdef(con.oid) LIKE '%status%'
    LOOP
        EXECUTE format('ALTER TABLE bookings DROP CONSTRAINT IF EXISTS %I', constraint_name);
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END LOOP;
END $$;

-- Now add the new constraint with all the status values
ALTER TABLE bookings
ADD CONSTRAINT bookings_status_check CHECK (
    status IN (
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
    )
);

-- Update any existing records with old status values to new ones
UPDATE bookings
SET status = CASE
    WHEN status = 'pending' THEN 'Pending'
    WHEN status = 'confirmed' THEN 'Documentation Prepared'
    WHEN status = 'in_transit' THEN 'In Transit to Destination'
    WHEN status = 'delivered' THEN 'Delivered'
    WHEN status = 'cancelled' THEN 'Cancelled'
    ELSE 'Pending'
END
WHERE status IN ('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled');
