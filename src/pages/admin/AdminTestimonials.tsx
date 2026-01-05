import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAllTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial, Testimonial } from '@/hooks/useTestimonials';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Quote, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const emptyTestimonial = {
  name_en: '',
  name_bn: '',
  role_en: '',
  role_bn: '',
  company: '',
  quote_en: '',
  quote_bn: '',
  avatar_url: '',
  is_active: true,
  display_order: 0,
};

const AdminTestimonials = () => {
  const { data: testimonials, isLoading } = useAllTestimonials();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();

  const [editingItem, setEditingItem] = useState<Partial<Testimonial> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setEditingItem({ ...editingItem, avatar_url: publicUrl });
      toast.success('Avatar uploaded');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = () => {
    setEditingItem({ ...editingItem, avatar_url: '' });
  };

  const handleSave = async () => {
    if (!editingItem?.name_en || !editingItem?.quote_en) {
      toast.error('Name and quote (English) are required');
      return;
    }

    try {
      if (editingItem.id) {
        await updateMutation.mutateAsync(editingItem as Testimonial);
        toast.success('Testimonial updated');
      } else {
        await createMutation.mutateAsync(editingItem as Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>);
        toast.success('Testimonial created');
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to save testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Testimonial deleted');
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  const openCreateDialog = () => {
    setEditingItem({ ...emptyTestimonial, display_order: (testimonials?.length || 0) + 1 });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: Testimonial) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AdminPageHeader
        title="Testimonials"
        description="Manage client testimonials displayed on the homepage"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          {editingItem && (
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingItem.id ? 'Edit' : 'Add'} Testimonial</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name (English) *</Label>
                    <Input
                      value={editingItem.name_en || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, name_en: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Name (Bangla)</Label>
                    <Input
                      value={editingItem.name_bn || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, name_bn: e.target.value })}
                      placeholder="জন ডো"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Role (English)</Label>
                    <Input
                      value={editingItem.role_en || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, role_en: e.target.value })}
                      placeholder="CEO, Company Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role (Bangla)</Label>
                    <Input
                      value={editingItem.role_bn || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, role_bn: e.target.value })}
                      placeholder="সিইও, কোম্পানির নাম"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      value={editingItem.company || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                      placeholder="Company Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Avatar</Label>
                    <div className="flex items-center gap-2">
                      {editingItem.avatar_url ? (
                        <div className="relative">
                          <img
                            src={editingItem.avatar_url}
                            alt="Avatar preview"
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground hover:bg-destructive/90"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          {editingItem.name_en?.charAt(0) || '?'}
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {isUploading ? 'Uploading...' : 'Upload'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Quote (English) *</Label>
                  <Textarea
                    value={editingItem.quote_en || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, quote_en: e.target.value })}
                    placeholder="Their testimonial quote..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quote (Bangla)</Label>
                  <Textarea
                    value={editingItem.quote_bn || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, quote_bn: e.target.value })}
                    placeholder="তাদের প্রশংসাপত্র..."
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Display Order</Label>
                    <Input
                      type="number"
                      value={editingItem.display_order || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      checked={editingItem.is_active ?? true}
                      onCheckedChange={(checked) => setEditingItem({ ...editingItem, is_active: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </AdminPageHeader>

      {isLoading ? (
        <AdminLoadingSkeleton />
      ) : !testimonials?.length ? (
        <AdminEmptyState
          icon={Quote}
          title="No testimonials yet"
          description="Add client testimonials to display on the homepage"
          action={
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.id} className={!item.is_active ? 'opacity-60' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {item.avatar_url ? (
                      <img
                        src={item.avatar_url}
                        alt={item.name_en}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {item.company?.charAt(0) || item.name_en.charAt(0)}
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-base">{item.name_en}</CardTitle>
                      <p className="text-sm text-muted-foreground">{item.role_en}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this testimonial? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">"{item.quote_en}"</p>
                {!item.is_active && (
                  <span className="mt-2 inline-block rounded bg-muted px-2 py-0.5 text-xs">Inactive</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTestimonials;
