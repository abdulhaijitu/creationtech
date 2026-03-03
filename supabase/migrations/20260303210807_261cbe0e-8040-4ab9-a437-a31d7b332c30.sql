ALTER TABLE public.portfolio_projects 
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS short_description_en text,
  ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;