import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, Briefcase, Save, Eye, EyeOff, Star, GripVertical } from 'lucide-react';
import RichTextEditor from '@/components/ui/rich-text-editor';

interface ServiceRow {
  id: string;
  slug: string;
  title_en: string;
  title_bn: string | null;
  description_en: string | null;
  description_bn: string | null;
  short_description_en: string | null;
  short_description_bn: string | null;
  icon: string | null;
  features: any;
  is_active: boolean | null;
  is_featured: boolean | null;
  display_order: number | null;
  featured_image_url: string | null;
  meta_title_en: string | null;
  meta_title_bn: string | null;
  meta_description_en: string | null;
  meta_description_bn: string | null;
  cta_text_en: string | null;
  cta_text_bn: string | null;
  cta_link: string | null;
  created_at: string;
  updated_at: string;
}

const defaultFormData = {
  slug: '',
  title_en: '',
  title_bn: '',
  short_description_en: '',
  short_description_bn: '',
  description_en: '',
  description_bn: '',
  icon: '',
  features: '',
  is_active: true,
  is_featured: false,
  featured_image_url: '',
  meta_title_en: '',
  meta_title_bn: '',
  meta_description_en: '',
  meta_description_bn: '',
  cta_text_en: 'Get Started',
  cta_text_bn: 'শুরু করুন',
  cta_link: '/contact',
};

const AdminServices = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceRow | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState(defaultFormData);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const { data: services, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as ServiceRow[];
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const saveMutation = useMutation({
    mutationFn: async (data: { id?: string; [key: string]: any }) => {
      const { id, ...updates } = data;
      if (id) {
        const { error } = await supabase.from('services').update(updates).eq('id', id);
        if (error) throw error;
      } else {
        const insertData = { ...updates, display_order: (services?.length || 0) };
        const { error } = await supabase.from('services').insert(insertData as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success(selectedService ? 'Service updated' : 'Service created');
      setIsDialogOpen(false);
    },
    onError: (err: any) => toast.error(err.message || 'Failed to save service'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service deleted');
      setIsDeleteOpen(false);
    },
    onError: () => toast.error('Failed to delete service'),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: string; value: boolean }) => {
      const { error } = await supabase.from('services').update({ [field]: value }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ fromIdx, toIdx }: { fromIdx: number; toIdx: number }) => {
      if (!services || fromIdx === toIdx) return;
      const reordered = [...services];
      const [moved] = reordered.splice(fromIdx, 1);
      reordered.splice(toIdx, 0, moved);

      const updates = reordered.map((s, i) => 
        supabase.from('services').update({ display_order: i }).eq('id', s.id)
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Order updated');
    },
    onError: () => toast.error('Failed to reorder'),
  });

  const handleDragStart = (idx: number) => setDragIndex(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIndex(idx);
  };
  const handleDrop = (toIdx: number) => {
    if (dragIndex !== null && dragIndex !== toIdx) {
      reorderMutation.mutate({ fromIdx: dragIndex, toIdx });
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const openCreate = () => {
    setSelectedService(null);
    setFormData(defaultFormData);
    setIsDialogOpen(true);
  };

  const openEdit = (service: ServiceRow) => {
    setSelectedService(service);
    const featuresArr = Array.isArray(service.features) ? service.features : [];
    setFormData({
      slug: service.slug,
      title_en: service.title_en,
      title_bn: service.title_bn || '',
      short_description_en: service.short_description_en || '',
      short_description_bn: service.short_description_bn || '',
      description_en: service.description_en || '',
      description_bn: service.description_bn || '',
      icon: service.icon || '',
      features: featuresArr.join('\n'),
      is_active: service.is_active ?? true,
      is_featured: service.is_featured ?? false,
      featured_image_url: service.featured_image_url || '',
      meta_title_en: service.meta_title_en || '',
      meta_title_bn: service.meta_title_bn || '',
      meta_description_en: service.meta_description_en || '',
      meta_description_bn: service.meta_description_bn || '',
      cta_text_en: service.cta_text_en || 'Get Started',
      cta_text_bn: service.cta_text_bn || 'শুরু করুন',
      cta_link: service.cta_link || '/contact',
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title_en.trim()) {
      toast.error('Service name (English) is required');
      return;
    }
    const slug = formData.slug.trim() || generateSlug(formData.title_en);
    const featuresArray = formData.features.split('\n').map(f => f.trim()).filter(Boolean);

    saveMutation.mutate({
      ...(selectedService ? { id: selectedService.id } : {}),
      slug,
      title_en: formData.title_en.trim(),
      title_bn: formData.title_bn.trim() || null,
      short_description_en: formData.short_description_en.trim() || null,
      short_description_bn: formData.short_description_bn.trim() || null,
      description_en: formData.description_en || null,
      description_bn: formData.description_bn || null,
      icon: formData.icon.trim() || null,
      features: featuresArray,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      featured_image_url: formData.featured_image_url.trim() || null,
      meta_title_en: formData.meta_title_en.trim() || null,
      meta_title_bn: formData.meta_title_bn.trim() || null,
      meta_description_en: formData.meta_description_en.trim() || null,
      meta_description_bn: formData.meta_description_bn.trim() || null,
      cta_text_en: formData.cta_text_en.trim() || 'Get Started',
      cta_text_bn: formData.cta_text_bn.trim() || 'শুরু করুন',
      cta_link: formData.cta_link.trim() || '/contact',
    });
  };

  const filtered = services?.filter(s =>
    s.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.title_bn && s.title_bn.includes(searchQuery))
  ) || [];

  if (isLoading) return <AdminLayout><AdminLoadingSkeleton /></AdminLayout>;

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Services Management"
        description="Add, edit, and manage services shown on the website"
      />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Add Service
        </Button>
      </div>

      {!filtered.length ? (
        <AdminEmptyState
          icon={Briefcase}
          title="No services found"
          description={searchQuery ? 'Try a different search term' : 'Click "Add Service" to create your first service'}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Order</TableHead>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((service, idx) => (
                  <TableRow
                    key={service.id}
                    draggable={!searchQuery}
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={() => handleDrop(idx)}
                    onDragEnd={handleDragEnd}
                    className={
                      dragOverIndex === idx
                        ? 'border-t-2 border-t-primary bg-primary/5'
                        : dragIndex === idx
                        ? 'opacity-50'
                        : ''
                    }
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                        <span className="text-xs text-muted-foreground font-medium">{(service.display_order ?? idx) + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{service.title_en}</p>
                        {service.title_bn && <p className="text-xs text-muted-foreground">{service.title_bn}</p>}
                        <p className="text-xs text-muted-foreground/70">/{service.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={service.is_active ?? true}
                        onCheckedChange={v => toggleMutation.mutate({ id: service.id, field: 'is_active', value: v })}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={service.is_featured ?? false}
                        onCheckedChange={v => toggleMutation.mutate({ id: service.id, field: 'is_featured', value: v })}
                      />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(service.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(service)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => { setSelectedService(service); setIsDeleteOpen(true); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            <DialogDescription>Fill in the service details. Fields marked with * are required.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="mt-2">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
            </TabsList>

            {/* Basic Info */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Service Name (English) *</Label>
                  <Input
                    value={formData.title_en}
                    onChange={e => {
                      const title = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        title_en: title,
                        slug: prev.slug || generateSlug(title),
                      }));
                    }}
                    placeholder="Web Development"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Service Name (Bangla)</Label>
                  <Input
                    value={formData.title_bn}
                    onChange={e => setFormData({ ...formData, title_bn: e.target.value })}
                    placeholder="ওয়েব ডেভেলপমেন্ট"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Short Summary (English)</Label>
                  <Textarea
                    value={formData.short_description_en}
                    onChange={e => setFormData({ ...formData, short_description_en: e.target.value })}
                    placeholder="1–2 line summary for card view"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Short Summary (Bangla)</Label>
                  <Textarea
                    value={formData.short_description_bn}
                    onChange={e => setFormData({ ...formData, short_description_bn: e.target.value })}
                    placeholder="কার্ড ভিউ-এর জন্য ১-২ লাইনের সারসংক্ষেপ"
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>SEO Slug *</Label>
                  <Input
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="web-development"
                  />
                  <p className="text-xs text-muted-foreground">Auto-generated from name, editable</p>
                </div>
                <div className="space-y-2">
                  <Label>Icon (Lucide icon name)</Label>
                  <Input
                    value={formData.icon}
                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g., Code, Smartphone, Cloud"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Features (one per line)</Label>
                <Textarea
                  value={formData.features}
                  onChange={e => setFormData({ ...formData, features: e.target.value })}
                  placeholder={"Feature 1\nFeature 2\nFeature 3"}
                  rows={4}
                />
              </div>
            </TabsContent>

            {/* Content */}
            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Full Description (English)</Label>
                <RichTextEditor
                  content={formData.description_en}
                  onChange={val => setFormData({ ...formData, description_en: val })}
                  placeholder="Detailed service description..."
                />
              </div>
              <div className="space-y-2">
                <Label>Full Description (Bangla)</Label>
                <RichTextEditor
                  content={formData.description_bn}
                  onChange={val => setFormData({ ...formData, description_bn: val })}
                  placeholder="বিস্তারিত সেবার বিবরণ..."
                />
              </div>
              <div className="space-y-2">
                <Label>Featured Image URL</Label>
                <Input
                  value={formData.featured_image_url}
                  onChange={e => setFormData({ ...formData, featured_image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.featured_image_url && (
                  <div className="mt-2 rounded-lg border overflow-hidden max-w-xs">
                    <img
                      src={formData.featured_image_url}
                      alt="Preview"
                      className="w-full h-auto"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            {/* SEO */}
            <TabsContent value="seo" className="space-y-4 mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Meta Title (English)</Label>
                  <Input
                    value={formData.meta_title_en}
                    onChange={e => setFormData({ ...formData, meta_title_en: e.target.value })}
                    placeholder="Web Development Services | Company"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">{formData.meta_title_en.length}/60</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Title (Bangla)</Label>
                  <Input
                    value={formData.meta_title_bn}
                    onChange={e => setFormData({ ...formData, meta_title_bn: e.target.value })}
                    maxLength={60}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Meta Description (English)</Label>
                  <Textarea
                    value={formData.meta_description_en}
                    onChange={e => setFormData({ ...formData, meta_description_en: e.target.value })}
                    placeholder="Brief SEO description..."
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">{formData.meta_description_en.length}/160</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Description (Bangla)</Label>
                  <Textarea
                    value={formData.meta_description_bn}
                    onChange={e => setFormData({ ...formData, meta_description_bn: e.target.value })}
                    maxLength={160}
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Display */}
            <TabsContent value="display" className="space-y-4 mt-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Show on Services Page</p>
                  <p className="text-sm text-muted-foreground">Toggle visibility on the frontend</p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={v => setFormData({ ...formData, is_active: v })}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Highlight as Featured</p>
                  <p className="text-sm text-muted-foreground">Featured services get special styling</p>
                </div>
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={v => setFormData({ ...formData, is_featured: v })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>CTA Text (English)</Label>
                  <Input
                    value={formData.cta_text_en}
                    onChange={e => setFormData({ ...formData, cta_text_en: e.target.value })}
                    placeholder="Get Started"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Text (Bangla)</Label>
                  <Input
                    value={formData.cta_text_bn}
                    onChange={e => setFormData({ ...formData, cta_text_bn: e.target.value })}
                    placeholder="শুরু করুন"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>CTA Link</Label>
                <Input
                  value={formData.cta_link}
                  onChange={e => setFormData({ ...formData, cta_link: e.target.value })}
                  placeholder="/contact or https://..."
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {saveMutation.isPending ? 'Saving...' : selectedService ? 'Update Service' : 'Create Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedService?.title_en}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedService && deleteMutation.mutate(selectedService.id)}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminServices;
