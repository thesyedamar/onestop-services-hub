-- Create table for real-time user locations
CREATE TABLE public.user_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own location
CREATE POLICY "Users can view their own location" 
ON public.user_locations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own location" 
ON public.user_locations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own location" 
ON public.user_locations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Providers can view customer locations (for booking purposes)
CREATE POLICY "Providers can view customer locations" 
ON public.user_locations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role IN ('provider', 'admin')
  )
);

-- Enable realtime for this table
ALTER TABLE public.user_locations REPLICA IDENTITY FULL;

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_locations;

-- Create trigger to update timestamp
CREATE TRIGGER update_user_locations_updated_at
BEFORE UPDATE ON public.user_locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();