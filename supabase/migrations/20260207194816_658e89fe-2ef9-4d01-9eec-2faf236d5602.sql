
-- Add missing columns to services table for complete CMS
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS short_description_en text,
  ADD COLUMN IF NOT EXISTS short_description_bn text,
  ADD COLUMN IF NOT EXISTS featured_image_url text,
  ADD COLUMN IF NOT EXISTS meta_title_en text,
  ADD COLUMN IF NOT EXISTS meta_title_bn text,
  ADD COLUMN IF NOT EXISTS meta_description_en text,
  ADD COLUMN IF NOT EXISTS meta_description_bn text,
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS cta_text_en text DEFAULT 'Get Started',
  ADD COLUMN IF NOT EXISTS cta_text_bn text DEFAULT 'শুরু করুন',
  ADD COLUMN IF NOT EXISTS cta_link text DEFAULT '/contact';
