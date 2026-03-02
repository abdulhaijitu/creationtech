-- Create bucket for company assets (logo, etc.)
INSERT INTO storage.buckets (id, name, public) VALUES ('company-assets', 'company-assets', true);

-- Allow anyone to view company assets
CREATE POLICY "Anyone can view company assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-assets');

-- Allow admins to upload company assets
CREATE POLICY "Admin can upload company assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'company-assets' AND (SELECT public.is_admin(auth.uid())));

-- Allow admins to update company assets
CREATE POLICY "Admin can update company assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'company-assets' AND (SELECT public.is_admin(auth.uid())));

-- Allow admins to delete company assets
CREATE POLICY "Admin can delete company assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'company-assets' AND (SELECT public.is_admin(auth.uid())));
