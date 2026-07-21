
-- Replace overly-permissive contact_messages INSERT policy
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(name)) BETWEEN 1 AND 100
    AND length(trim(email)) BETWEEN 3 AND 255
    AND length(trim(message)) BETWEEN 1 AND 2000
  );

-- Revoke direct EXECUTE on SECURITY DEFINER functions from public roles.
-- RLS policies and the auth.users trigger still evaluate them internally.
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
