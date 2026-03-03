ALTER TABLE public.proposal_items 
ADD COLUMN billing_type text NOT NULL DEFAULT 'one_time';