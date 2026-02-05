-- Payments table for tracking invoice payments
CREATE TABLE public.payments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'cash',
    status TEXT NOT NULL DEFAULT 'pending',
    transaction_id TEXT,
    notes TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Internal notes table
CREATE TABLE public.internal_notes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    author_id UUID,
    author_name TEXT,
    tagged_users UUID[],
    visibility TEXT NOT NULL DEFAULT 'all',
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tasks/Follow-ups table
CREATE TABLE public.tasks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to UUID,
    assigned_to_name TEXT,
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    follow_up_notes TEXT,
    reminder_at TIMESTAMP WITH TIME ZONE,
    related_entity_type TEXT,
    related_entity_id UUID,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    title TEXT NOT NULL,
    message TEXT,
    type TEXT NOT NULL DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    entity_type TEXT,
    entity_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Products management table
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_bn TEXT,
    short_description_en TEXT,
    short_description_bn TEXT,
    description_en TEXT,
    description_bn TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    highlights JSONB DEFAULT '[]'::jsonb,
    media JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'active',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- System settings table
CREATE TABLE public.system_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(category, key)
);

-- Permissions table for role-based access
CREATE TABLE public.permissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    role app_role NOT NULL,
    module TEXT NOT NULL,
    can_view BOOLEAN DEFAULT false,
    can_create BOOLEAN DEFAULT false,
    can_edit BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(role, module)
);

-- Enable RLS on all new tables
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payments
CREATE POLICY "Admin can manage payments" ON public.payments FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin can view payments" ON public.payments FOR SELECT USING (is_admin(auth.uid()));

-- RLS Policies for internal_notes
CREATE POLICY "Admin can manage internal notes" ON public.internal_notes FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin can view internal notes" ON public.internal_notes FOR SELECT USING (is_admin(auth.uid()));

-- RLS Policies for tasks
CREATE POLICY "Admin can manage tasks" ON public.tasks FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admin can view tasks" ON public.tasks FOR SELECT USING (is_admin(auth.uid()));

-- RLS Policies for notifications
CREATE POLICY "Admin can manage notifications" ON public.notifications FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid() OR is_admin(auth.uid()));
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for products
CREATE POLICY "Admin can manage products" ON public.products FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (status = 'active');

-- RLS Policies for system_settings
CREATE POLICY "Admin can manage system settings" ON public.system_settings FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can view system settings" ON public.system_settings FOR SELECT USING (is_admin(auth.uid()));

-- RLS Policies for permissions
CREATE POLICY "Admin can manage permissions" ON public.permissions FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can view permissions" ON public.permissions FOR SELECT USING (is_admin(auth.uid()));

-- Insert default permissions for all roles
INSERT INTO public.permissions (role, module, can_view, can_create, can_edit, can_delete) VALUES
-- Admin permissions (full access)
('admin', 'dashboard', true, true, true, true),
('admin', 'leads', true, true, true, true),
('admin', 'quotations', true, true, true, true),
('admin', 'proposals', true, true, true, true),
('admin', 'invoices', true, true, true, true),
('admin', 'clients', true, true, true, true),
('admin', 'payments', true, true, true, true),
('admin', 'employees', true, true, true, true),
('admin', 'attendance', true, true, true, true),
('admin', 'roles', true, true, true, true),
('admin', 'notes', true, true, true, true),
('admin', 'products', true, true, true, true),
('admin', 'cms', true, true, true, true),
('admin', 'tasks', true, true, true, true),
('admin', 'notifications', true, true, true, true),
('admin', 'settings', true, true, true, true),
-- Manager permissions
('manager', 'dashboard', true, false, false, false),
('manager', 'leads', true, true, true, false),
('manager', 'quotations', true, true, true, false),
('manager', 'proposals', true, true, true, false),
('manager', 'invoices', true, true, true, false),
('manager', 'clients', true, true, true, false),
('manager', 'payments', true, true, true, false),
('manager', 'employees', true, false, false, false),
('manager', 'attendance', true, true, true, false),
('manager', 'notes', true, true, true, false),
('manager', 'products', true, false, true, false),
('manager', 'cms', true, false, true, false),
('manager', 'tasks', true, true, true, false),
('manager', 'notifications', true, false, false, false),
('manager', 'settings', false, false, false, false),
-- Developer permissions (read-only mostly)
('developer', 'dashboard', true, false, false, false),
('developer', 'leads', true, false, false, false),
('developer', 'quotations', true, false, false, false),
('developer', 'proposals', true, false, false, false),
('developer', 'invoices', true, false, false, false),
('developer', 'clients', true, false, false, false),
('developer', 'payments', true, false, false, false),
('developer', 'employees', false, false, false, false),
('developer', 'attendance', false, false, false, false),
('developer', 'notes', true, true, true, false),
('developer', 'products', true, false, false, false),
('developer', 'cms', true, false, false, false),
('developer', 'tasks', true, true, true, false),
('developer', 'notifications', true, false, false, false),
('developer', 'settings', false, false, false, false);

-- Insert default products
INSERT INTO public.products (slug, name_en, name_bn, short_description_en, status, display_order) VALUES
('isp-manager', 'ISP Manager', 'আইএসপি ম্যানেজার', 'Complete ISP billing and management solution', 'active', 1),
('somity-app', 'Somity App', 'সমিতি অ্যাপ', 'Microfinance and cooperative management system', 'active', 2),
('restaurant-app', 'Restaurant App', 'রেস্টুরেন্ট অ্যাপ', 'Restaurant POS and management system', 'active', 3);

-- Insert default system settings
INSERT INTO public.system_settings (category, key, value) VALUES
('general', 'company_name', 'Creation Tech'),
('general', 'timezone', 'Asia/Dhaka'),
('general', 'currency', 'BDT'),
('general', 'date_format', 'DD/MM/YYYY'),
('general', 'language_default', 'en'),
('payment', 'gateway_enabled', 'false'),
('payment', 'test_mode', 'true'),
('sms', 'provider', ''),
('sms', 'sender_id', ''),
('sms', 'enabled', 'false');

-- Create updated_at triggers
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_internal_notes_updated_at BEFORE UPDATE ON public.internal_notes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_permissions_updated_at BEFORE UPDATE ON public.permissions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();