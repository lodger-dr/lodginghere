-- Migration: 005_lodge_images_bucket.sql
-- Description: Creates the public lodge-images bucket for landlord room/lodge pictures with appropriate RLS policies

-- 1. Create storage bucket lodge-images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lodge-images',
  'lodge-images',
  true,
  10485760, -- 10MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

-- 2. Storage Policies for lodge-images
-- Public read access: Anyone (students, visitors, landlords) can view room pictures
CREATE POLICY "Public read lodge images" ON storage.objects
  FOR SELECT USING (bucket_id = 'lodge-images');

-- Landlords and authenticated users can upload room pictures
CREATE POLICY "Landlords can upload lodge images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'lodge-images' 
    AND auth.role() = 'authenticated'
  );

-- Landlords can update their own pictures
CREATE POLICY "Landlords can update own lodge images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'lodge-images'
    AND auth.uid() = owner
  );

-- Landlords can delete their own pictures
CREATE POLICY "Landlords can delete own lodge images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'lodge-images'
    AND auth.uid() = owner
  );
