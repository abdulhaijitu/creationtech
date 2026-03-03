
-- Create product_categories table
CREATE TABLE public.product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_bn text,
  slug text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view active product categories"
  ON public.product_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage product categories"
  ON public.product_categories FOR ALL
  USING (is_admin(auth.uid()));

-- Add category column to products
ALTER TABLE public.products ADD COLUMN category text;
