
CREATE POLICY "Public read event-covers" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'event-covers');
CREATE POLICY "Public read gallery" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'gallery');
CREATE POLICY "Public read team-photos" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'team-photos');
