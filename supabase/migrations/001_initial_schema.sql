-- 001_initial_schema.sql
-- CropPilot AI Database Schema for Supabase

-- 1. Create Farms Table
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT 'farmer_demo_1',
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    total_area_acres NUMERIC(8, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Fields Table
CREATE TABLE IF NOT EXISTS public.fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    soil_type TEXT NOT NULL,
    irrigation_type TEXT NOT NULL DEFAULT 'Drip Irrigation',
    area_acres NUMERIC(8, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Crops Table
CREATE TABLE IF NOT EXISTS public.crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    variety TEXT,
    planting_date DATE DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Healthy',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Advisories Table
CREATE TABLE IF NOT EXISTS public.advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT 'farmer_demo_1',
    crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    growth_stage TEXT DEFAULT 'Vegetative',
    weather_condition TEXT DEFAULT 'Sunny / Moderate Humidity',
    soil_condition TEXT,
    diagnosis TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('Low', 'Moderate', 'High', 'Critical')),
    organic_remedies JSONB DEFAULT '[]'::jsonb,
    chemical_remedies JSONB DEFAULT '[]'::jsonb,
    preventive_measures JSONB DEFAULT '[]'::jsonb,
    irrigation_advice TEXT,
    disclaimer TEXT,
    raw_ai_response JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;

-- Permissive RLS Policies for demonstration and development
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow public access to farms" ON public.farms;
    CREATE POLICY "Allow public access to farms" ON public.farms FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public access to fields" ON public.fields;
    CREATE POLICY "Allow public access to fields" ON public.fields FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public access to crops" ON public.crops;
    CREATE POLICY "Allow public access to crops" ON public.crops FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow public access to advisories" ON public.advisories;
    CREATE POLICY "Allow public access to advisories" ON public.advisories FOR ALL USING (true) WITH CHECK (true);
END $$;

-- Seed Data (Initial Demonstration Farm & Crops)
INSERT INTO public.farms (id, user_id, name, location, total_area_acres)
VALUES 
    ('e1111111-1111-1111-1111-111111111111', 'farmer_demo_1', 'Green Valley Agro Farm', 'Punjab, North Zone', 25.5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.fields (id, farm_id, name, soil_type, irrigation_type, area_acres)
VALUES
    ('f1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'North Field A', 'Alluvial Loam', 'Drip Irrigation', 10.0),
    ('f2222222-2222-2222-2222-222222222222', 'e1111111-1111-1111-1111-111111111111', 'South Greenhouse B', 'Clay Loam', 'Sprinkler', 8.5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.crops (id, field_id, crop_name, variety, planting_date, status)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'Tomato', 'Roma Hybrid', CURRENT_DATE - INTERVAL '35 days', 'Flowering'),
    ('c2222222-2222-2222-2222-222222222222', 'f1111111-1111-1111-1111-111111111111', 'Wheat', 'Sharbati HD-2967', CURRENT_DATE - INTERVAL '60 days', 'Tillering'),
    ('c3333333-3333-3333-3333-333333333333', 'f2222222-2222-2222-2222-222222222222', 'Cotton', 'Bt Cotton Hybrid', CURRENT_DATE - INTERVAL '20 days', 'Vegetative')
ON CONFLICT (id) DO NOTHING;
