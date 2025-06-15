-- Enable Row Level Security on existing tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create policies for companies table
CREATE POLICY "Company admins can view their company" 
ON public.companies 
FOR SELECT 
USING (auth.uid() = admin_user_id);

CREATE POLICY "Company admins can update their company" 
ON public.companies 
FOR UPDATE 
USING (auth.uid() = admin_user_id);

CREATE POLICY "Authenticated users can create companies" 
ON public.companies 
FOR INSERT 
WITH CHECK (auth.uid() = admin_user_id);

-- Update the handle_new_user function to support company creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  company_name text;
  cnpj_value text;
  role_value text;
BEGIN
  -- Extract metadata from the user signup
  company_name := NEW.raw_user_meta_data ->> 'company_name';
  cnpj_value := NEW.raw_user_meta_data ->> 'cnpj';
  role_value := COALESCE(NEW.raw_user_meta_data ->> 'role', 'admin');

  -- Insert into profiles
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    CASE WHEN company_name IS NOT NULL THEN 'admin' ELSE 'candidate' END
  );

  -- If company data is provided, create company
  IF company_name IS NOT NULL THEN
    INSERT INTO public.companies (name, cnpj, admin_user_id)
    VALUES (company_name, cnpj_value, NEW.id);
  END IF;

  RETURN NEW;
END;
$$;