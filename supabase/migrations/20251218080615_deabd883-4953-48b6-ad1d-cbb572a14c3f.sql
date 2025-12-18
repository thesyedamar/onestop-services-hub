-- Drop the existing select policy
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;

-- Create new policy that allows everyone to see active services, but admins can see all
CREATE POLICY "View services"
ON public.services
FOR SELECT
USING (
  is_active = true 
  OR public.has_role(auth.uid(), 'admin')
);