
-- Create proposal_items table (like invoice_items/quotation_items)
CREATE TABLE public.proposal_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  amount NUMERIC NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.proposal_items ENABLE ROW LEVEL SECURITY;

-- RLS policies (same pattern as invoice_items/quotation_items)
CREATE POLICY "Admin can manage proposal items"
ON public.proposal_items
FOR ALL
USING (EXISTS (
  SELECT 1 FROM proposals
  WHERE proposals.id = proposal_items.proposal_id AND is_admin(auth.uid())
));

CREATE POLICY "Admin can view proposal items"
ON public.proposal_items
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM proposals
  WHERE proposals.id = proposal_items.proposal_id AND is_admin(auth.uid())
));

-- Add financial breakdown columns to proposals
ALTER TABLE public.proposals
  ADD COLUMN subtotal NUMERIC DEFAULT 0,
  ADD COLUMN tax_rate NUMERIC DEFAULT 0,
  ADD COLUMN tax_amount NUMERIC DEFAULT 0,
  ADD COLUMN discount_amount NUMERIC DEFAULT 0;
