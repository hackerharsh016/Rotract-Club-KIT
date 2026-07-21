-- Grant EXECUTE permission on public.has_role back to public roles.
-- This is necessary because RLS policies reference this function, and
-- when users query tables with these policies, they must have permission
-- to execute the function in the policy condition.
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO anon, authenticated;
