-- Create quotations table
CREATE TABLE public.quotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_number TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_address TEXT,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax_rate NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  terms TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quotation_items table
CREATE TABLE public.quotation_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  amount NUMERIC NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create proposals table
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_number TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_company TEXT,
  title TEXT NOT NULL,
  scope_of_work TEXT,
  timeline TEXT,
  deliverables TEXT,
  pricing_summary TEXT,
  total_amount NUMERIC DEFAULT 0,
  valid_until DATE,
  status TEXT NOT NULL DEFAULT 'draft',
  notes TEXT,
  terms TEXT,
  version INTEGER DEFAULT 1,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quotations
CREATE POLICY "Admin can manage quotations" ON public.quotations
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admin can view quotations" ON public.quotations
  FOR SELECT USING (is_admin(auth.uid()));

-- RLS Policies for quotation_items
CREATE POLICY "Admin can manage quotation items" ON public.quotation_items
  FOR ALL USING (EXISTS (
    SELECT 1 FROM quotations WHERE quotations.id = quotation_items.quotation_id AND is_admin(auth.uid())
  ));

CREATE POLICY "Admin can view quotation items" ON public.quotation_items
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM quotations WHERE quotations.id = quotation_items.quotation_id AND is_admin(auth.uid())
  ));

-- RLS Policies for proposals
CREATE POLICY "Admin can manage proposals" ON public.proposals
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admin can view proposals" ON public.proposals
  FOR SELECT USING (is_admin(auth.uid()));

-- Function to generate quotation number
CREATE OR REPLACE FUNCTION public.generate_quotation_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
  new_number TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(quotation_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.quotations
  WHERE quotation_number LIKE 'QUO-%';
  
  new_number := 'QUO-' || LPAD(next_num::TEXT, 5, '0');
  RETURN new_number;
END;
$$;

-- Function to generate proposal number
CREATE OR REPLACE FUNCTION public.generate_proposal_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
  new_number TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(proposal_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.proposals
  WHERE proposal_number LIKE 'PRO-%';
  
  new_number := 'PRO-' || LPAD(next_num::TEXT, 5, '0');
  RETURN new_number;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_quotations_updated_at
  BEFORE UPDATE ON public.quotations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();