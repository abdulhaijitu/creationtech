import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, ExternalLink, Building2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type SisterConcern = Tables<'sister_concerns'>;

interface FormData {
  name_en: string;
  name_bn: string;
  tagline_en: string;
  tagline_bn: string;
  website_url: string;
  display_order: number;
  is_active: boolean;
}

const defaultForm: FormData = {
  name_en: '',
  name_bn: '',
  tagline_en: '',
  tagline_bn: '',
  website_url: '',
  display_order: 0,
  is_active: true,
};

const AdminSisterConcerns = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const { data: concerns, isLoading } = useQuery({
    queryKey: ['admin-sister-concerns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sister_concerns')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as SisterConcern[];
    },
  });

  const uploadLogo = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const path = `sister-concerns/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('company-assets').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('company-assets').getPublicUrl(path);
    return data.publicUrl;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      let logo_url: string | undefined;
      if (logoFile) {
        logo_url = await uploadLogo(logoFile);
      }

      const payload = {
        name_en: form.name_en,
        name_bn: form.name_bn || null,
        tagline_en: form.tagline_en || null,
        tagline_bn: form.tagline_bn || null,
        website_url: form.website_url || null,
        display_order: form.display_order,
        is_active: form.is_active,
        ...(logo_url ? { logo_url } : {}),
      };

      if (editingId) {
        const { error } = await supabase.from('sister_concerns').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('sister_concerns').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sister-concerns'] });
      queryClient.invalidateQueries({ queryKey: ['sister-concerns'] });
      toast({ title: editingId ? 'আপডেট সফল' : 'যোগ করা হয়েছে' });
      closeDialog();
    },
    onError: (err: Error) => {
      toast({ title: 'ত্রুটি', description: err.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('sister_concerns').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sister-concerns'] });
      queryClient.invalidateQueries({ queryKey: ['sister-concerns'] });
      toast({ title: 'মুছে ফেলা হয়েছে' });
      setDeleteId(null);
    },
  });

  const openEdit = (item: SisterConcern) => {
    setEditingId(item.id);
    setForm({
      name_en: item.name_en,
      name_bn: item.name_bn || '',
      tagline_en: item.tagline_en || '',
      tagline_bn: item.tagline_bn || '',
      website_url: item.website_url || '',
      display_order: item.display_order || 0,
      is_active: item.is_active ?? true,
    });
    setLogoFile(null);
    setDialogOpen(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(defaultForm);
    setLogoFile(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(defaultForm);
    setLogoFile(null);
  };

  return (
    <AdminLayout>
      <AdminPageHeader title="Sister Concerns" description="Manage sister concern companies shown on the homepage.">
        <Button onClick={openAdd} size="sm"><Plus className="h-4 w-4 mr-1" /> Add New</Button>
      </AdminPageHeader>

      {isLoading ? (
        <AdminLoadingSkeleton />
      ) : !concerns?.length ? (
        <AdminEmptyState icon={Building2} title="No sister concerns" description="Add your first sister concern company." action={<Button onClick={openAdd} size="sm"><Plus className="h-4 w-4 mr-1" /> Add Sister Concern</Button>} />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Tagline</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {concerns.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.logo_url && <img src={item.logo_url} alt={item.name_en} className="h-8 w-auto object-contain" />}
                  </TableCell>
                  <TableCell className="font-medium">{item.name_en}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{item.tagline_en}</TableCell>
                  <TableCell>{item.display_order}</TableCell>
                  <TableCell>
                    <span className={`inline-block h-2 w-2 rounded-full ${item.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {item.website_url && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={item.website_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit' : 'Add'} Sister Concern</DialogTitle>
            <DialogDescription>Fill in the details for this sister concern company.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name (EN) *</Label>
                <Input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Name (BN)</Label>
                <Input value={form.name_bn} onChange={(e) => setForm({ ...form, name_bn: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tagline (EN)</Label>
                <Input value={form.tagline_en} onChange={(e) => setForm({ ...form, tagline_en: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Tagline (BN)</Label>
                <Input value={form.tagline_bn} onChange={(e) => setForm({ ...form, tagline_bn: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} placeholder="https://" />
            </div>
            <div className="space-y-2">
              <Label>Logo</Label>
              <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                <Label>Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()} disabled={!form.name_en || saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this sister concern.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminSisterConcerns;
