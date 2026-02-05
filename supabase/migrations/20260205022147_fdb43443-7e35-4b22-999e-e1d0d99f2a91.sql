-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  designation TEXT,
  join_date DATE,
  salary NUMERIC,
  status TEXT NOT NULL DEFAULT 'active',
  avatar_url TEXT,
  address TEXT,
  emergency_contact TEXT,
  notes TEXT,
  documents JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status TEXT NOT NULL DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(employee_id, date)
);

-- Enable RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for departments
CREATE POLICY "Admin can manage departments" ON public.departments
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admin can view departments" ON public.departments
  FOR SELECT USING (is_admin(auth.uid()));

-- RLS Policies for employees
CREATE POLICY "Admin can manage employees" ON public.employees
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admin can view employees" ON public.employees
  FOR SELECT USING (is_admin(auth.uid()));

-- RLS Policies for attendance
CREATE POLICY "Admin can manage attendance" ON public.attendance
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admin can view attendance" ON public.attendance
  FOR SELECT USING (is_admin(auth.uid()));

-- Function to generate employee ID
CREATE OR REPLACE FUNCTION public.generate_employee_id()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
  new_id TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(employee_id FROM 5) AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.employees
  WHERE employee_id LIKE 'EMP-%';
  
  new_id := 'EMP-' || LPAD(next_num::TEXT, 4, '0');
  RETURN new_id;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();