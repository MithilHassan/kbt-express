-- Drop the old status check constraint
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- Update old status values to new ones
UPDATE bookings SET status = 'Pending' WHERE status = 'pending';
UPDATE bookings SET status = 'Documentation Prepared' WHERE status = 'confirmed';
UPDATE bookings SET status = 'In Transit to Destination' WHERE status = 'in_transit';
UPDATE bookings SET status = 'Delivered' WHERE status = 'delivered';
UPDATE bookings SET status = 'Cancelled' WHERE status = 'cancelled';

-- Set default status to 'Pending' for any null or empty values
UPDATE bookings
SET status = 'Pending'
WHERE status IS NULL OR status = '';

-- Add new check constraint with all the new status values
ALTER TABLE public.bookings
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

-- Update the default value for new bookings
ALTER TABLE public.bookings ALTER COLUMN status SET DEFAULT 'Pending';
