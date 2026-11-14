-- Migration: 003_storage.sql
-- Description: Sets up Supabase storage buckets and security policies

-- 1. Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('property-media', 'property-media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4']),
  ('verification-private', 'verification-private', false, 15728640, ARRAY['image/jpeg', 'image/png', 'application/pdf']),
  ('profile-media', 'profile-media', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Policies for property-media
CREATE POLICY "Public read property media" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-media');

CREATE POLICY "Landlords can upload property media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'property-media' 
    AND auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'landlord')
  );

CREATE POLICY "Landlords can update own property media" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'property-media'
    AND auth.uid() = owner
  );

CREATE POLICY "Landlords can delete own property media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'property-media'
    AND auth.uid() = owner
  );

-- 3. Storage Policies for verification-private (strictly private: only owner and admin)
CREATE POLICY "Private verification access: owner and admin" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'verification-private'
    AND (
      auth.uid() = owner 
      OR public.is_admin()
    )
  );

CREATE POLICY "Landlords can upload private verification files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'verification-private'
    AND auth.role() = 'authenticated'
    AND (auth.uid() = owner OR auth.uid()::text = (storage.foldername(name))[1])
  );

-- 4. Storage Policies for profile-media
CREATE POLICY "Public read profile media" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-media');

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-media'
    AND auth.role() = 'authenticated'
    AND auth.uid() = owner
  );

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-media'
    AND auth.uid() = owner
  );

