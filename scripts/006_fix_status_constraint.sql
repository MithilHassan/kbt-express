-- Drop the existing check constraint on the status column
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- Add new check constraint with all the new status values
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

-- Update any existing records with old status values to new ones
UPDATE bookings 
SET status = 'Pending' 
WHERE status IN ('pending', 'confirmed');

UPDATE bookings 
SET status = 'In Transit to Destination' 
WHERE status = 'in_transit';

UPDATE bookings 
SET status = 'Delivered' 
WHERE status = 'delivered';

UPDATE bookings 
SET status = 'Cancelled' 
WHERE status = 'cancelled';
