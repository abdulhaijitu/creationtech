
-- Create portfolio_categories table
CREATE TABLE public.portfolio_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_bn text,
  slug text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view active categories
CREATE POLICY "Anyone can view active portfolio categories"
  ON public.portfolio_categories
  FOR SELECT
  USING (is_active = true);

-- Admin can manage categories
CREATE POLICY "Admin can manage portfolio categories"
  ON public.portfolio_categories
  FOR ALL
  USING (is_admin(auth.uid()));
