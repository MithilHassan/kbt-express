-- Update bookings table to use registration type and number instead of separate fields
ALTER TABLE public.bookings
DROP COLUMN IF EXISTS shipper_bin_eori_ioss_gst,
DROP COLUMN IF EXISTS shipper_other_number,
DROP COLUMN IF EXISTS consignee_bin_eori_ioss_gst,
DROP COLUMN IF EXISTS consignee_other_number;

-- Add new registration type and number columns
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS shipper_registration_type TEXT,
ADD COLUMN IF NOT EXISTS shipper_registration_number TEXT,
ADD COLUMN IF NOT EXISTS consignee_registration_type TEXT,
ADD COLUMN IF NOT EXISTS consignee_registration_number TEXT;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_shipper_registration ON public.bookings(shipper_registration_type);
CREATE INDEX IF NOT EXISTS idx_bookings_consignee_registration ON public.bookings(consignee_registration_type);
