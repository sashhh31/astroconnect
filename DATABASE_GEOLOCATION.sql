-- PostGIS Geolocation Setup
-- Run in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE astrologers 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS location GEOGRAPHY(POINT, 4326);

CREATE INDEX IF NOT EXISTS idx_astrologers_location ON astrologers USING GIST(location);

CREATE OR REPLACE FUNCTION find_nearby_astrologers(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_km DECIMAL DEFAULT 10,
  result_limit INTEGER DEFAULT 10,
  result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  display_name TEXT,
  profile_image_url TEXT,
  experience_years INTEGER,
  average_rating DECIMAL,
  is_online BOOLEAN,
  chat_rate DECIMAL,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id, a.full_name, a.display_name, a.profile_image_url,
    a.experience_years, a.average_rating, a.is_online, a.chat_rate,
    ROUND(ST_Distance(a.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography) / 1000, 2)::DECIMAL
  FROM astrologers a
  WHERE a.status = 'active' AND a.location IS NOT NULL
    AND ST_DWithin(a.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography, radius_km * 1000)
  ORDER BY distance_km LIMIT result_limit OFFSET result_offset;
END;
$$ LANGUAGE plpgsql;
