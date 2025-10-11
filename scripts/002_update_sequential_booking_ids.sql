-- Update booking number generation to use sequential KBT format
-- This script creates a sequence-based booking number system

-- Create a sequence counter table for booking numbers
CREATE TABLE IF NOT EXISTS public.booking_sequence (
  id SERIAL PRIMARY KEY,
  current_number INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial value if table is empty
INSERT INTO public.booking_sequence (current_number) 
SELECT 0 
WHERE NOT EXISTS (SELECT 1 FROM public.booking_sequence);

-- Update the booking number generation function to use sequential KBT format
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TEXT AS $$
DECLARE
  seq_num INTEGER;
  booking_num TEXT;
BEGIN
  -- Get and increment the sequence number atomically
  UPDATE public.booking_sequence 
  SET current_number = current_number + 1,
      updated_at = NOW()
  RETURNING current_number INTO seq_num;
  
  -- Format: KBT + 6-digit sequential number (KBT000001, KBT000002, etc.)
  booking_num := 'KBT' || LPAD(seq_num::TEXT, 6, '0');
  RETURN booking_num;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security for the sequence table
ALTER TABLE public.booking_sequence ENABLE ROW LEVEL SECURITY;

-- Create policies for the sequence table (restrict access)
CREATE POLICY "Allow system to update sequence" ON public.booking_sequence
  FOR UPDATE USING (true);

CREATE POLICY "Allow system to select sequence" ON public.booking_sequence
  FOR SELECT USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_booking_sequence_current_number ON public.booking_sequence(current_number);

-- Optional: Update existing bookings to use new format (uncomment if needed)
-- WARNING: This will change all existing booking numbers
-- UPDATE public.bookings 
-- SET booking_number = 'KBT' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 6, '0')
-- WHERE booking_number LIKE 'BK%';
