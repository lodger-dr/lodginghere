-- Migration: 001_geography.sql
-- Description: Sets up Nigeria geography and universities reference tables

-- 1. States table
CREATE TABLE IF NOT EXISTS public.states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Cities / Local Government Areas table
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id UUID NOT NULL REFERENCES public.states(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    lga_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Universities table
CREATE TABLE IF NOT EXISTS public.universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    acronym VARCHAR(30),
    university_type VARCHAR(20) NOT NULL CHECK (university_type IN ('federal', 'state', 'private', 'other')),
    state_id UUID REFERENCES public.states(id) ON DELETE SET NULL,
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    website_url TEXT,
    logo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Campuses table
CREATE TABLE IF NOT EXISTS public.campuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Neighbourhoods table
CREATE TABLE IF NOT EXISTS public.neighbourhoods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
    campus_id UUID REFERENCES public.campuses(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cities_state_id ON public.cities(state_id);
CREATE INDEX IF NOT EXISTS idx_universities_slug ON public.universities(slug);
CREATE INDEX IF NOT EXISTS idx_universities_state_id ON public.universities(state_id);
CREATE INDEX IF NOT EXISTS idx_campuses_university_id ON public.campuses(university_id);
CREATE INDEX IF NOT EXISTS idx_neighbourhoods_campus_id ON public.neighbourhoods(campus_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighbourhoods ENABLE ROW LEVEL SECURITY;

-- Read policies: public can read reference tables
CREATE POLICY "Public read states" ON public.states
    FOR SELECT USING (true);

CREATE POLICY "Public read cities" ON public.cities
    FOR SELECT USING (true);

CREATE POLICY "Public read active universities" ON public.universities
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read active campuses" ON public.campuses
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read neighbourhoods" ON public.neighbourhoods
    FOR SELECT USING (true);

