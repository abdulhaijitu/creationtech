ALTER TABLE invoice_items ADD COLUMN billing_type text NOT NULL DEFAULT 'one_time';
ALTER TABLE invoice_items ADD COLUMN billing_period text;
ALTER TABLE invoices ADD COLUMN billing_period_start date;
ALTER TABLE invoices ADD COLUMN billing_period_end date;
ALTER TABLE invoices ADD COLUMN is_recurring boolean DEFAULT false;