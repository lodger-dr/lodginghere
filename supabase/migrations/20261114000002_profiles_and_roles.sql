-- Migration: 002_profiles_and_roles.sql
-- Description: Creates user profiles, roles, student/landlord details, and strict security rules

-- 1. Enums
CREATE TYPE public.user_role AS ENUM ('student', 'landlord', 'admin');
CREATE TYPE public.provider_type AS ENUM ('owner', 'authorized_representative');
CREATE TYPE public.verification_status AS ENUM (
    'not_submitted',
    'pending',
    'verified',
    'rejected',
    'needs_information',
    'suspended'
);

-- 2. Profiles table (linked directly to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.user_role NOT NULL DEFAULT 'student',
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Student Profiles
CREATE TABLE IF NOT EXISTS public.student_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
    campus_id UUID REFERENCES public.campuses(id) ON DELETE SET NULL,
    department TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Landlord Profiles
CREATE TABLE IF NOT EXISTS public.landlord_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider_type public.provider_type NOT NULL DEFAULT 'owner',
    verification_status public.verification_status NOT NULL DEFAULT 'not_submitted',
    business_name TEXT,
    contact_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Helper function: check if caller is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 6. Trigger to prevent non-admins from changing their role or landlord verification status
CREATE OR REPLACE FUNCTION public.protect_profile_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If role is changing and user is not admin, reject
  IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Users cannot modify their assigned role';
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER tr_protect_profile_privilege_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_privilege_escalation();

CREATE OR REPLACE FUNCTION public.protect_landlord_verification_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.verification_status IS DISTINCT FROM OLD.verification_status AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Verification status can only be updated by platform administrators';
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER tr_protect_landlord_verification_status
BEFORE UPDATE ON public.landlord_profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_landlord_verification_status();

-- 7. Trigger on auth.users creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_role public.user_role;
  v_full_name TEXT;
  v_provider_type public.provider_type;
  v_business_name TEXT;
  v_university_id UUID;
BEGIN
  -- Default to 'student'; only allow explicit 'landlord' if requested. Never allow 'admin' from signup metadata.
  IF (NEW.raw_user_meta_data->>'role') = 'landlord' THEN
    v_role := 'landlord'::public.user_role;
  ELSE
    v_role := 'student'::public.user_role;
  END IF;

  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));

  -- Insert profile
  INSERT INTO public.profiles (id, role, full_name, email, phone)
  VALUES (
    NEW.id,
    v_role,
    v_full_name,
    NEW.email,
    NEW.raw_user_meta_data->>'phone'
  );

  -- Insert subprofile based on role
  IF v_role = 'student' THEN
    IF (NEW.raw_user_meta_data->>'university_id') IS NOT NULL AND (NEW.raw_user_meta_data->>'university_id') <> '' THEN
      v_university_id := (NEW.raw_user_meta_data->>'university_id')::UUID;
    ELSE
      v_university_id := NULL;
    END IF;

    INSERT INTO public.student_profiles (user_id, university_id, department)
    VALUES (
      NEW.id,
      v_university_id,
      NEW.raw_user_meta_data->>'department'
    );
  ELSIF v_role = 'landlord' THEN
    IF (NEW.raw_user_meta_data->>'provider_type') = 'authorized_representative' THEN
      v_provider_type := 'authorized_representative'::public.provider_type;
    ELSE
      v_provider_type := 'owner'::public.provider_type;
    END IF;
    v_business_name := NEW.raw_user_meta_data->>'business_name';

    INSERT INTO public.landlord_profiles (user_id, provider_type, business_name)
    VALUES (
      NEW.id,
      v_provider_type,
      v_business_name
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger execution on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 8. Row Level Security policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landlord_profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Public can view landlord basic profiles" ON public.profiles
    FOR SELECT USING (role = 'landlord');

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Student profiles policies
CREATE POLICY "Students can read own student profile" ON public.student_profiles
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Students can update own student profile" ON public.student_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Students can insert own student profile" ON public.student_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Landlord profiles policies
CREATE POLICY "Landlords can read own landlord profile" ON public.landlord_profiles
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Public can view verified landlord status" ON public.landlord_profiles
    FOR SELECT USING (verification_status = 'verified');

CREATE POLICY "Landlords can update own landlord profile" ON public.landlord_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Landlords can insert own landlord profile" ON public.landlord_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

