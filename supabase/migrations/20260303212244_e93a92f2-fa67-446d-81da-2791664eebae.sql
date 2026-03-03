ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS price text,
  ADD COLUMN IF NOT EXISTS demo_url text;