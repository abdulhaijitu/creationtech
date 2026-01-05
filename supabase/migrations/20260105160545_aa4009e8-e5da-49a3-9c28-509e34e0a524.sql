-- Create business_info table for centralized business information
CREATE TABLE public.business_info (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value_en text,
  value_bn text,
  metadata jsonb DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_info ENABLE ROW LEVEL SECURITY;

-- Admin can manage business info
CREATE POLICY "Admin can manage business info"
ON public.business_info
FOR ALL
USING (is_admin(auth.uid()));

-- Anyone can view business info
CREATE POLICY "Anyone can view business info"
ON public.business_info
FOR SELECT
USING (true);

-- Create page_content table for CMS-managed static pages
CREATE TABLE public.page_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug text NOT NULL,
  section_key text NOT NULL,
  title_en text,
  title_bn text,
  content_en text,
  content_bn text,
  meta_title_en text,
  meta_title_bn text,
  meta_description_en text,
  meta_description_bn text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(page_slug, section_key)
);

-- Enable RLS
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Admin can manage page content
CREATE POLICY "Admin can manage page content"
ON public.page_content
FOR ALL
USING (is_admin(auth.uid()));

-- Anyone can view active page content
CREATE POLICY "Anyone can view active page content"
ON public.page_content
FOR SELECT
USING (is_active = true);

-- Create trigger for updated_at on business_info
CREATE TRIGGER update_business_info_updated_at
BEFORE UPDATE ON public.business_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on page_content
CREATE TRIGGER update_page_content_updated_at
BEFORE UPDATE ON public.page_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default business info
INSERT INTO public.business_info (key, value_en, value_bn, metadata) VALUES
('company_name', 'Creation Tech', 'ক্রিয়েশন টেক', '{}'),
('address', '123 Tech Street, Gulshan-2, Dhaka 1212, Bangladesh', '১২৩ টেক স্ট্রিট, গুলশান-২, ঢাকা ১২১২, বাংলাদেশ', '{}'),
('phone_primary', '+880 1XXX-XXXXXX', '+৮৮০ ১XXX-XXXXXX', '{}'),
('phone_secondary', '+880 2-XXXXXXXX', '+৮৮০ ২-XXXXXXXX', '{}'),
('email_primary', 'info@creationtech.com', 'info@creationtech.com', '{}'),
('email_support', 'support@creationtech.com', 'support@creationtech.com', '{}'),
('business_hours', 'Sun - Thu: 9:00 AM - 6:00 PM', 'রবি - বৃহস্পতি: সকাল ৯:০০ - সন্ধ্যা ৬:০০', '{}'),
('map_embed', '', '', '{"lat": "23.7925", "lng": "90.4078"}'),
('social_facebook', 'https://facebook.com/creationtech', 'https://facebook.com/creationtech', '{}'),
('social_twitter', 'https://twitter.com/creationtech', 'https://twitter.com/creationtech', '{}'),
('social_linkedin', 'https://linkedin.com/company/creationtech', 'https://linkedin.com/company/creationtech', '{}'),
('social_instagram', 'https://instagram.com/creationtech', 'https://instagram.com/creationtech', '{}');