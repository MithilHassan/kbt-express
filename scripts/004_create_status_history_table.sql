-- Create status_history table to track all status changes with timestamps
CREATE TABLE IF NOT EXISTS status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_status_history_booking_id ON status_history(booking_id);
CREATE INDEX IF NOT EXISTS idx_status_history_timestamp ON status_history(timestamp);

-- Add initial status for existing bookings
INSERT INTO status_history (booking_id, status, timestamp)
SELECT id, COALESCE(status, 'Pending'), created_at
FROM bookings
WHERE id NOT IN (SELECT DISTINCT booking_id FROM status_history);
