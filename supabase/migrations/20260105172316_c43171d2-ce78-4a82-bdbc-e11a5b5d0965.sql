-- Create storage bucket for testimonial avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Allow anyone to view avatars (public bucket)
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- Allow admins to upload avatars
CREATE POLICY "Admins can upload avatars"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND is_admin(auth.uid()));

-- Allow admins to update avatars
CREATE POLICY "Admins can update avatars"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'avatars' AND is_admin(auth.uid()));

-- Allow admins to delete avatars
CREATE POLICY "Admins can delete avatars"
ON storage.objects
FOR DELETE
USING (bucket_id = 'avatars' AND is_admin(auth.uid()));