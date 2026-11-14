-- Migration: 004_properties_and_inspections.sql
-- Description: Creates properties/lodges, rooms, inspection requests, and bookings tables with RLS

-- 1. Listing Enums
CREATE TYPE public.accommodation_type AS ENUM (
    'self_contained',
    'single_room',
    'shared_apartment',
    'one_bedroom',
    'two_bedroom',
    'hostel',
    'other'
);

CREATE TYPE public.listing_status AS ENUM (
    'draft',
    'pending_review',
    'approved',
    'changes_requested',
    'rejected',
    'suspended',
    'archived'
);

CREATE TYPE public.room_availability_status AS ENUM (
    'available',
    'temporarily_unavailable',
    'reserved_pending',
    'occupied',
    'archived'
);

CREATE TYPE public.inspection_status AS ENUM (
    'pending',
    'accepted',
    'reschedule_requested',
    'rejected',
    'cancelled',
    'completed',
    'expired'
);

CREATE TYPE public.booking_status AS ENUM (
    'draft',
    'pending_landlord_response',
    'accepted_by_landlord',
    'awaiting_student_confirmation',
    'confirmed',
    'rejected',
    'cancelled',
    'expired'
);

-- 2. Properties (Lodges) Table
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landlord_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE RESTRICT,
    campus_id UUID REFERENCES public.campuses(id) ON DELETE SET NULL,
    neighbourhood_id UUID REFERENCES public.neighbourhoods(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    distance_to_campus TEXT NOT NULL,
    accommodation_type public.accommodation_type NOT NULL DEFAULT 'self_contained',
    min_price NUMERIC(12, 2) NOT NULL,
    max_price NUMERIC(12, 2) NOT NULL,
    caution_deposit NUMERIC(12, 2) NOT NULL DEFAULT 0,
    service_charge NUMERIC(12, 2) NOT NULL DEFAULT 0,
    legal_agency_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    amenities TEXT[] NOT NULL DEFAULT '{}',
    images TEXT[] NOT NULL DEFAULT '{}',
    status public.listing_status NOT NULL DEFAULT 'pending_review',
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
    review_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    room_number TEXT NOT NULL,
    title TEXT NOT NULL,
    accommodation_type public.accommodation_type NOT NULL DEFAULT 'self_contained',
    annual_rent NUMERIC(12, 2) NOT NULL,
    total_units INTEGER NOT NULL DEFAULT 1,
    available_units INTEGER NOT NULL DEFAULT 1,
    status public.room_availability_status NOT NULL DEFAULT 'available',
    features TEXT[] NOT NULL DEFAULT '{}',
    images TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Inspections Table
CREATE TABLE IF NOT EXISTS public.inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    landlord_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    requested_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL CHECK (time_slot IN ('morning', 'afternoon', 'evening')),
    status public.inspection_status NOT NULL DEFAULT 'pending',
    rescheduled_date DATE,
    rescheduled_time_slot VARCHAR(20) CHECK (rescheduled_time_slot IN ('morning', 'afternoon', 'evening')),
    student_notes TEXT,
    landlord_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    landlord_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status public.booking_status NOT NULL DEFAULT 'pending_landlord_response',
    total_amount NUMERIC(12, 2) NOT NULL,
    move_in_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_university_id ON public.properties(university_id);
CREATE INDEX IF NOT EXISTS idx_properties_landlord_id ON public.properties(landlord_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_rooms_property_id ON public.rooms(property_id);
CREATE INDEX IF NOT EXISTS idx_inspections_student_id ON public.inspections(student_id);
CREATE INDEX IF NOT EXISTS idx_inspections_landlord_id ON public.inspections(landlord_id);
CREATE INDEX IF NOT EXISTS idx_inspections_property_id ON public.inspections(property_id);

-- Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Property Policies: Anyone can view approved properties, landlords can view & edit their own
CREATE POLICY "Public read approved properties" ON public.properties
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Landlords manage own properties" ON public.properties
    FOR ALL USING (auth.uid() = landlord_id);

CREATE POLICY "Public read approved rooms" ON public.rooms
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = rooms.property_id AND p.status = 'approved'
        )
    );

CREATE POLICY "Landlords manage own rooms" ON public.rooms
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = rooms.property_id AND p.landlord_id = auth.uid()
        )
    );

-- Inspections Policies: Students manage their inspections, landlords manage received inspections
CREATE POLICY "Students view own inspections" ON public.inspections
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students insert inspections" ON public.inspections
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Landlords view their properties inspections" ON public.inspections
    FOR SELECT USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords update inspections" ON public.inspections
    FOR UPDATE USING (auth.uid() = landlord_id);
