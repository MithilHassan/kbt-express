-- Create bookings table for courier service
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Shipper Information
  shipper_company_name TEXT NOT NULL,
  shipper_contact_person TEXT NOT NULL,
  shipper_address_line TEXT NOT NULL,
  shipper_city TEXT NOT NULL,
  shipper_zip TEXT NOT NULL,
  shipper_state TEXT NOT NULL,
  shipper_country TEXT NOT NULL,
  shipper_phone TEXT NOT NULL,
  shipper_email TEXT NOT NULL,
  
  -- Consignee Information
  consignee_company_name TEXT NOT NULL,
  consignee_contact_person TEXT NOT NULL,
  consignee_address_line TEXT NOT NULL,
  consignee_city TEXT NOT NULL,
  consignee_zip TEXT NOT NULL,
  consignee_state TEXT NOT NULL,
  consignee_country TEXT NOT NULL,
  consignee_phone TEXT NOT NULL,
  consignee_email TEXT NOT NULL,
  
  -- Shipment Information
  payment_mode TEXT NOT NULL CHECK (payment_mode IN ('COD', 'Prepaid', 'Credit')),
  amount DECIMAL(10,2),
  reference_number TEXT,
  pieces INTEGER NOT NULL DEFAULT 1,
  product_value DECIMAL(10,2),
  billing_weight_kg DECIMAL(8,3),
  billing_weight_gm DECIMAL(8,3),
  gross_weight DECIMAL(8,3),
  item_type TEXT NOT NULL CHECK (item_type IN ('SPX', 'Docs')),
  remarks TEXT,
  item_description TEXT NOT NULL,
  
  -- Dimensional Weight Calculation
  length_cm DECIMAL(8,2),
  width_cm DECIMAL(8,2),
  height_cm DECIMAL(8,2),
  dimensional_weight DECIMAL(8,3),
  
  -- Booking Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled')),
  booking_number TEXT UNIQUE NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a booking form for customers)
-- Note: For a production system, you might want to add authentication
CREATE POLICY "Allow public to insert bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public to view their bookings" ON public.bookings
  FOR SELECT USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_booking_number ON public.bookings(booking_number);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- Function to generate booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TEXT AS $$
DECLARE
  booking_num TEXT;
BEGIN
  booking_num := 'BK' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN booking_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate booking number
CREATE OR REPLACE FUNCTION set_booking_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_number IS NULL OR NEW.booking_number = '' THEN
    NEW.booking_number := generate_booking_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_booking_number
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_number();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
