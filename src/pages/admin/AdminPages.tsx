import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, FileText, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import RichTextEditor from '@/components/ui/rich-text-editor';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  useAllPageContent,
  useCreatePageContent,
  useUpdatePageContent,
  useDeletePageContent,
  PageContent,
} from '@/hooks/usePageContent';
import { useAuth } from '@/contexts/AuthContext';

// Legal pages that cannot be deleted by managers
const PROTECTED_LEGAL_PAGES = ['terms', 'privacy', 'refund', 'cookies'];

const AVAILABLE_PAGES = [
  { slug: 'home', label: 'Home Page', category: 'main' },
  { slug: 'about', label: 'About Us', category: 'main' },
  { slug: 'services', label: 'Services', category: 'main' },
  { slug: 'contact', label: 'Contact', category: 'main' },
  { slug: 'pricing', label: 'Pricing', category: 'main' },
  { slug: 'careers', label: 'Careers', category: 'main' },
  { slug: 'blog', label: 'Blog', category: 'main' },
  { slug: 'terms', label: 'Terms & Conditions', category: 'legal' },
  { slug: 'privacy', label: 'Privacy Policy', category: 'legal' },
  { slug: 'refund', label: 'Refund Policy', category: 'legal' },
  { slug: 'cookies', label: 'Cookie Policy', category: 'legal' },
];

const AdminPages = () => {
  const { toast } = useToast();
  const { role } = useAuth();
  const { data: allContent, isLoading } = useAllPageContent();
  const createMutation = useCreatePageContent();
  const updateMutation = useUpdatePageContent();
  const deleteMutation = useDeletePageContent();

  const [selectedPage, setSelectedPage] = useState('home');
  const [editingSection, setEditingSection] = useState<PageContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PageContent>>({});

  const canEdit = role === 'admin' || role === 'manager';
  const canDeleteLegalPages = role === 'admin'; // Only admin can delete legal pages

  const pageContent = allContent?.filter((c) => c.page_slug === selectedPage) ?? [];
  const isLegalPage = PROTECTED_LEGAL_PAGES.includes(selectedPage);

  useEffect(() => {
    if (editingSection) {
      setFormData(editingSection);
    } else {
      setFormData({
        page_slug: selectedPage,
        section_key: '',
        title_en: '',
        title_bn: '',
        content_en: '',
        content_bn: '',
        meta_title_en: '',
        meta_title_bn: '',
        meta_description_en: '',
        meta_description_bn: '',
        display_order: 0,
        is_active: true,
      });
    }
  }, [editingSection, selectedPage]);

  const handleSave = async () => {
    if (!formData.section_key) {
      toast({
        title: 'Section key required',
        description: 'Please enter a unique section key.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingSection) {
        await updateMutation.mutateAsync({
          id: editingSection.id,
          ...formData,
        });
        toast({ title: 'Section updated', description: 'Content section has been saved.' });
      } else {
        await createMutation.mutateAsync({
          page_slug: selectedPage,
          section_key: formData.section_key!,
          title_en: formData.title_en ?? null,
          title_bn: formData.title_bn ?? null,
          content_en: formData.content_en ?? null,
          content_bn: formData.content_bn ?? null,
          meta_title_en: formData.meta_title_en ?? null,
          meta_title_bn: formData.meta_title_bn ?? null,
          meta_description_en: formData.meta_description_en ?? null,
          meta_description_bn: formData.meta_description_bn ?? null,
          display_order: formData.display_order ?? 0,
          is_active: formData.is_active ?? true,
        });
        toast({ title: 'Section created', description: 'New content section has been added.' });
      }
      setIsDialogOpen(false);
      setEditingSection(null);
    } catch (error) {
      toast({
        title: 'Error saving',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: 'Section deleted', description: 'Content section has been removed.' });
      setDeleteConfirm(null);
    } catch (error) {
      toast({
        title: 'Error deleting',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openCreateDialog = () => {
    setEditingSection(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (section: PageContent) => {
    setEditingSection(section);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <AdminLoadingSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Page Content"
        description="Manage content sections for static pages"
        action={
          canEdit && (
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          )
        }
      />

      {!canEdit && (
        <div className="mb-4 rounded-lg border border-muted bg-muted/50 p-3 text-sm text-muted-foreground">
          You have read-only access to this section.
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Label htmlFor="page-select">Select Page:</Label>
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_PAGES.map((page) => (
                <SelectItem key={page.slug} value={page.slug}>
                  {page.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {pageContent.length === 0 ? (
          <AdminEmptyState
            icon={FileText}
            title="No content sections"
            description="Add content sections to manage this page from the CMS."
            action={
              canEdit && (
                <Button onClick={openCreateDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              )
            }
          />
        ) : (
          <div className="space-y-4">
            {pageContent.map((section) => (
              <Card key={section.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {section.is_active ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      {section.section_key}
                    </CardTitle>
                    <CardDescription>
                      {section.title_en || 'No title set'}
                    </CardDescription>
                  </div>
                  {canEdit && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(section)}>
                        Edit
                      </Button>
                      {/* Hide delete button for legal pages if user is not admin */}
                      {(!isLegalPage || canDeleteLegalPages) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirm(section.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {section.content_en || 'No content set'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSection ? 'Edit Section' : 'Add New Section'}
            </DialogTitle>
            <DialogDescription>
              {editingSection
                ? 'Update the content for this section'
                : 'Create a new content section for this page'}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="content" className="space-y-4">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="section_key">Section Key *</Label>
                <Input
                  id="section_key"
                  value={formData.section_key ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, section_key: e.target.value }))
                  }
                  placeholder="e.g., hero, about_intro, cta"
                  disabled={!!editingSection}
                />
                <p className="text-xs text-muted-foreground">
                  Unique identifier for this section (cannot be changed after creation)
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title_en">Title (English)</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en ?? ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title_en: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_bn">Title (বাংলা)</Label>
                  <Input
                    id="title_bn"
                    value={formData.title_bn ?? ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title_bn: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content_en">Content (English)</Label>
                <RichTextEditor
                  content={formData.content_en ?? ''}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, content_en: value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content_bn">Content (বাংলা)</Label>
                <RichTextEditor
                  content={formData.content_bn ?? ''}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, content_bn: value }))
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="meta_title_en">Meta Title (English)</Label>
                  <Input
                    id="meta_title_en"
                    value={formData.meta_title_en ?? ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, meta_title_en: e.target.value }))
                    }
                    placeholder="Page title for search engines"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_title_bn">Meta Title (বাংলা)</Label>
                  <Input
                    id="meta_title_bn"
                    value={formData.meta_title_bn ?? ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, meta_title_bn: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="meta_description_en">Meta Description (English)</Label>
                  <Textarea
                    id="meta_description_en"
                    value={formData.meta_description_en ?? ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, meta_description_en: e.target.value }))
                    }
                    rows={3}
                    placeholder="Brief description for search results"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_description_bn">Meta Description (বাংলা)</Label>
                  <Textarea
                    id="meta_description_bn"
                    value={formData.meta_description_bn ?? ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, meta_description_bn: e.target.value }))
                    }
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order ?? 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      display_order: parseInt(e.target.value) || 0,
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active ?? true}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
                <Label htmlFor="is_active">Active (visible on website)</Label>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this section?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The content will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminPages;
