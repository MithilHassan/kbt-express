-- Create packages table to support multiple weight/dimension entries per booking
CREATE TABLE IF NOT EXISTS packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  
  -- Weight information
  billing_weight_kg NUMERIC DEFAULT 0,
  billing_weight_gm NUMERIC DEFAULT 0,
  gross_weight NUMERIC DEFAULT 0,
  
  -- Dimensions
  length_cm NUMERIC DEFAULT 0,
  width_cm NUMERIC DEFAULT 0,
  height_cm NUMERIC DEFAULT 0,
  pieces INTEGER DEFAULT 1,
  
  -- Calculated fields
  dimensional_weight NUMERIC DEFAULT 0,
  
  -- Package description
  description TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_packages_booking_id ON packages(booking_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_packages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW
  EXECUTE FUNCTION update_packages_updated_at();
