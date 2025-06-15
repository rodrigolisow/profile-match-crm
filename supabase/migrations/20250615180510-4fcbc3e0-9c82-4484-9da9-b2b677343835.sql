-- Add company_id to candidates table to link them to companies
ALTER TABLE public.candidates ADD COLUMN company_id UUID REFERENCES public.companies(id);

-- Create invitations table to track candidate invitations
CREATE TABLE public.invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  candidate_email TEXT NOT NULL,
  candidate_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  invited_by UUID REFERENCES auth.users(id) NOT NULL,
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on invitations
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create security definer function to get user's company
CREATE OR REPLACE FUNCTION public.get_current_user_company()
RETURNS UUID AS $$
  SELECT c.id FROM public.companies c
  WHERE c.admin_user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Update policies for admin access to companies
CREATE POLICY "Admins can view their own company" 
ON public.companies 
FOR SELECT 
USING (admin_user_id = auth.uid());

CREATE POLICY "Admins can update their own company" 
ON public.companies 
FOR UPDATE 
USING (admin_user_id = auth.uid());

-- Update policies for candidates with company isolation
DROP POLICY IF EXISTS "Users can view their own candidate data" ON public.candidates;
DROP POLICY IF EXISTS "Users can update their own candidate data" ON public.candidates;
DROP POLICY IF EXISTS "Users can create their own candidate data" ON public.candidates;

CREATE POLICY "Candidates can view their own data" 
ON public.candidates 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Candidates can update their own data" 
ON public.candidates 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Candidates can create their own data" 
ON public.candidates 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view their company candidates" 
ON public.candidates 
FOR SELECT 
USING (
  public.get_current_user_role() = 'admin' AND 
  company_id = public.get_current_user_company()
);

-- Update policies for results with company isolation
DROP POLICY IF EXISTS "Candidates can view their own results" ON public.results;
DROP POLICY IF EXISTS "Candidates can create their own results" ON public.results;
DROP POLICY IF EXISTS "Candidates can update their own results" ON public.results;

CREATE POLICY "Candidates can view their own results" 
ON public.results 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.candidates 
    WHERE id = candidate_id AND id = auth.uid()
  )
);

CREATE POLICY "Candidates can create their own results" 
ON public.results 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.candidates 
    WHERE id = candidate_id AND id = auth.uid()
  )
);

CREATE POLICY "Candidates can update their own results" 
ON public.results 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.candidates 
    WHERE id = candidate_id AND id = auth.uid()
  )
);

CREATE POLICY "Admins can view their company results" 
ON public.results 
FOR SELECT 
USING (
  public.get_current_user_role() = 'admin' AND 
  EXISTS (
    SELECT 1 FROM public.candidates c 
    WHERE c.id = candidate_id AND c.company_id = public.get_current_user_company()
  )
);

-- Policies for invitations
CREATE POLICY "Admins can view their company invitations" 
ON public.invitations 
FOR SELECT 
USING (
  public.get_current_user_role() = 'admin' AND 
  company_id = public.get_current_user_company()
);

CREATE POLICY "Admins can create invitations for their company" 
ON public.invitations 
FOR INSERT 
WITH CHECK (
  public.get_current_user_role() = 'admin' AND 
  company_id = public.get_current_user_company()
);

CREATE POLICY "Admins can update their company invitations" 
ON public.invitations 
FOR UPDATE 
USING (
  public.get_current_user_role() = 'admin' AND 
  company_id = public.get_current_user_company()
);

-- Add trigger for invitations timestamps
CREATE TRIGGER update_invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();