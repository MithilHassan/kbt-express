-- Add tax identification number fields to bookings table
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS shipper_bin_eori_ioss_gst TEXT,
ADD COLUMN IF NOT EXISTS shipper_other_number TEXT,
ADD COLUMN IF NOT EXISTS consignee_bin_eori_ioss_gst TEXT,
ADD COLUMN IF NOT EXISTS consignee_other_number TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_shipper_tax_id ON public.bookings(shipper_bin_eori_ioss_gst);
CREATE INDEX IF NOT EXISTS idx_bookings_consignee_tax_id ON public.bookings(consignee_bin_eori_ioss_gst);
