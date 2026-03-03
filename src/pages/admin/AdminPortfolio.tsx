import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowLeft, Save, Settings2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import ProductImageUpload from '@/components/admin/ProductImageUpload';
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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PortfolioProject {
  id: string;
  slug: string;
  title_en: string;
  title_bn: string | null;
  client_en: string | null;
  client_bn: string | null;
  description_en: string | null;
  description_bn: string | null;
  category: string | null;
  tags: string[];
  result_en: string | null;
  result_bn: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
}

interface PortfolioCategory {
  id: string;
  name_en: string;
  name_bn: string | null;
  slug: string;
  is_active: boolean;
  display_order: number;
}

const emptyFormData = {
  slug: '',
  title_en: '',
  client_en: '',
  client_bn: '',
  description_en: '',
  description_bn: '',
  short_description_en: '',
  category: '',
  tags: '',
  result_en: '',
  result_bn: '',
  image_url: '',
  website_url: '',
  display_order: 0,
  is_featured: false,
  is_active: true,
};

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

const AdminPortfolio = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(emptyFormData);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Category management state
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PortfolioCategory | null>(null);
  const [catForm, setCatForm] = useState({ name_en: '', name_bn: '', slug: '' });
  const [isCatSaving, setIsCatSaving] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<PortfolioCategory | null>(null);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setProjects((data || []).map(p => ({ ...p, tags: Array.isArray(p.tags) ? p.tags : [] })));
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({ title: 'Error', description: 'Failed to load projects', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); fetchCategories(); }, []);

  const handleTitleEnChange = useCallback((value: string) => {
    setFormData(prev => ({
      ...prev,
      title_en: value,
      ...(!slugManuallyEdited ? { slug: generateSlug(value) } : {}),
    }));
  }, [slugManuallyEdited]);

  const openCreate = () => {
    setSelectedProject(null);
    setSlugManuallyEdited(false);
    setFormData(emptyFormData);
    setViewMode('create');
  };

  const openEdit = (project: PortfolioProject) => {
    setSelectedProject(project);
    setSlugManuallyEdited(true);
    setFormData({
      slug: project.slug,
      title_en: project.title_en,
      client_en: project.client_en || '',
      client_bn: project.client_bn || '',
      description_en: project.description_en || '',
      description_bn: project.description_bn || '',
      short_description_en: (project as any).short_description_en || '',
      category: project.category || '',
      tags: project.tags.join(', '),
      result_en: project.result_en || '',
      result_bn: project.result_bn || '',
      image_url: project.image_url || '',
      website_url: (project as any).website_url || '',
      display_order: (project as any).display_order ?? 0,
      is_featured: project.is_featured,
      is_active: project.is_active,
    });
    setViewMode('edit');
  };

  const goBack = () => {
    setViewMode('list');
    setSelectedProject(null);
  };

  const handleSave = async () => {
    if (!formData.slug || !formData.title_en) {
      toast({ title: 'Validation Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      const projectData = {
        slug: formData.slug,
        title_en: formData.title_en,
        title_bn: null,
        client_en: formData.client_en || null,
        client_bn: formData.client_bn || null,
        description_en: formData.description_en || null,
        description_bn: formData.description_bn || null,
        short_description_en: formData.short_description_en || null,
        category: formData.category || null,
        tags: tagsArray,
        result_en: formData.result_en || null,
        result_bn: formData.result_bn || null,
        image_url: formData.image_url || null,
        website_url: formData.website_url || null,
        display_order: formData.display_order,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
      };

      if (selectedProject) {
        const { error } = await supabase.from('portfolio_projects').update(projectData).eq('id', selectedProject.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Project updated successfully' });
      } else {
        const { error } = await supabase.from('portfolio_projects').insert({ ...projectData, display_order: projects.length });
        if (error) throw error;
        toast({ title: 'Success', description: 'Project created successfully' });
      }
      goBack();
      fetchProjects();
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast({ title: 'Error', description: error.message || 'Failed to save project', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    try {
      const { error } = await supabase.from('portfolio_projects').delete().eq('id', selectedProject.id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Project deleted successfully' });
      setIsDeleteDialogOpen(false);
      goBack();
      fetchProjects();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to delete project', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (project: PortfolioProject) => {
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .update({ is_active: !project.is_active })
        .eq('id', project.id);
      if (error) throw error;
      toast({ title: 'Success', description: `Project ${project.is_active ? 'deactivated' : 'activated'}` });
      fetchProjects();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to update', variant: 'destructive' });
    }
  };

  // ─── CATEGORY MANAGEMENT ───
  const openCategoryCreate = () => {
    setEditingCategory(null);
    setCatForm({ name_en: '', name_bn: '', slug: '' });
  };

  const openCategoryEdit = (cat: PortfolioCategory) => {
    setEditingCategory(cat);
    setCatForm({ name_en: cat.name_en, name_bn: cat.name_bn || '', slug: cat.slug });
  };

  const handleCategorySave = async () => {
    if (!catForm.name_en) {
      toast({ title: 'Error', description: 'Category name (English) is required', variant: 'destructive' });
      return;
    }
    setIsCatSaving(true);
    const slug = catForm.slug || generateSlug(catForm.name_en);
    try {
      if (editingCategory) {
        const { error } = await supabase.from('portfolio_categories')
          .update({ name_en: catForm.name_en, name_bn: catForm.name_bn || null, slug })
          .eq('id', editingCategory.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Category updated' });
      } else {
        const { error } = await supabase.from('portfolio_categories')
          .insert({ name_en: catForm.name_en, name_bn: catForm.name_bn || null, slug, display_order: categories.length });
        if (error) throw error;
        toast({ title: 'Success', description: 'Category created' });
      }
      setEditingCategory(null);
      setCatForm({ name_en: '', name_bn: '', slug: '' });
      fetchCategories();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save category', variant: 'destructive' });
    } finally {
      setIsCatSaving(false);
    }
  };

  const handleCategoryToggle = async (cat: PortfolioCategory) => {
    try {
      const { error } = await supabase.from('portfolio_categories')
        .update({ is_active: !cat.is_active })
        .eq('id', cat.id);
      if (error) throw error;
      fetchCategories();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleCategoryDelete = async () => {
    if (!deletingCategory) return;
    try {
      const { error } = await supabase.from('portfolio_categories').delete().eq('id', deletingCategory.id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Category deleted' });
      setDeletingCategory(null);
      fetchCategories();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const activeCategories = categories.filter(c => c.is_active);

  // ─── FORM VIEW ───
  if (viewMode !== 'list') {
    return (
      <AdminLayout>
        <div className="mb-4">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />Back to Portfolio
          </Button>
        </div>

        <AdminPageHeader
          title={viewMode === 'edit' ? formData.title_en || 'Edit Project' : 'Add New Project'}
          description={viewMode === 'edit' ? 'Update project details' : 'Fill in the project details below'}
          action={
            viewMode === 'edit' && selectedProject ? (
              <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />Delete
              </Button>
            ) : undefined
          }
        />

        <div className="grid gap-6">
          {/* Card 1: Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Basic Information
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="is_featured_toggle" className="text-sm font-normal">Featured</Label>
                    <Switch id="is_featured_toggle" checked={formData.is_featured} onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="is_active_toggle" className="text-sm font-normal">Active</Label>
                    <Switch id="is_active_toggle" checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title (English) <span className="text-destructive">*</span></Label>
                  <Input value={formData.title_en} onChange={(e) => handleTitleEnChange(e.target.value)} placeholder="Project title" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value === '__none__' ? '' : value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">No Category</SelectItem>
                      {activeCategories.map(cat => (
                        <SelectItem key={cat.id} value={cat.name_en}>{cat.name_en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Slug <span className="text-destructive">*</span></Label>
                  <Input value={formData.slug} onChange={(e) => { setSlugManuallyEdited(true); setFormData({ ...formData, slug: e.target.value }); }} placeholder="auto-generated-from-title" className="font-mono text-xs" />
                  <p className="text-[11px] text-muted-foreground mt-1">Auto-generated from title</p>
                </div>
                <div>
                  <Label>Website URL</Label>
                  <Input value={formData.website_url} onChange={(e) => setFormData({ ...formData, website_url: e.target.value })} placeholder="https://example.com" type="url" />
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div>
                <Label>Short Description</Label>
                <Textarea value={formData.short_description_en} onChange={(e) => setFormData({ ...formData, short_description_en: e.target.value })} rows={3} placeholder="Brief project summary" />
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Project Image */}
          <Card>
            <CardHeader><CardTitle>Project Image</CardTitle></CardHeader>
            <CardContent>
              <ProductImageUpload
                productId={selectedProject?.id || 'new-portfolio'}
                currentImageUrl={formData.image_url || null}
                onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                onImageRemoved={() => setFormData({ ...formData, image_url: '' })}
              />
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />{isSaving ? 'Saving...' : viewMode === 'edit' ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </div>

        {/* Delete Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>Are you sure you want to delete "{selectedProject?.title_en}"?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminLayout>
    );
  }

  // ─── LIST VIEW ───
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Portfolio</h1>
            <p className="text-muted-foreground">Manage your portfolio projects</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
              <Settings2 className="mr-2 h-4 w-4" />
              Manage Categories
            </Button>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {isLoading ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">Loading...</CardContent></Card>
          ) : projects.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No projects yet.</CardContent></Card>
          ) : (
            projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardContent className="flex items-center gap-4 py-4">
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title_en} className="h-16 w-24 rounded-md object-cover flex-shrink-0 bg-muted" />
                  ) : (
                    <div className="h-16 w-24 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                      <Eye className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium truncate">{project.title_en}</h3>
                      {project.is_featured && <Badge variant="secondary" className="text-[10px]">Featured</Badge>}
                      {project.category && <Badge variant="outline" className="text-[10px]">{project.category}</Badge>}
                    </div>
                    {project.client_en && <p className="text-xs text-muted-foreground mt-0.5">{project.client_en}</p>}
                    <p className="text-xs text-muted-foreground/60 mt-0.5">/{project.slug}</p>
                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {project.tags.slice(0, 4).map((tag, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <AdminStatusBadge status={project.is_active ? 'active' : 'inactive'} />
                    <Button variant="ghost" size="icon" onClick={() => handleToggleActive(project)} title={project.is_active ? 'Deactivate' : 'Activate'}>
                      {project.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(project)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedProject(project); setIsDeleteDialogOpen(true); }} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Delete Project Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete "{selectedProject?.title_en}"?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Category Management Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Portfolio Categories</DialogTitle>
          </DialogHeader>

          {/* Add / Edit form */}
          <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
            <p className="text-sm font-medium">{editingCategory ? 'Edit Category' : 'Add New Category'}</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Name (English) *</Label>
                <Input
                  value={catForm.name_en}
                  onChange={(e) => {
                    setCatForm(prev => ({
                      ...prev,
                      name_en: e.target.value,
                      ...(!editingCategory ? { slug: generateSlug(e.target.value) } : {}),
                    }));
                  }}
                  placeholder="Web App"
                />
              </div>
              <div>
                <Label className="text-xs">Name (Bangla)</Label>
                <Input value={catForm.name_bn} onChange={(e) => setCatForm({ ...catForm, name_bn: e.target.value })} placeholder="ওয়েব অ্যাপ" className="font-bangla" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Slug</Label>
              <Input value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} placeholder="auto-generated" className="font-mono text-xs" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCategorySave} disabled={isCatSaving}>
                {isCatSaving ? 'Saving...' : editingCategory ? 'Update' : 'Add Category'}
              </Button>
              {editingCategory && (
                <Button size="sm" variant="ghost" onClick={openCategoryCreate}>Cancel</Button>
              )}
            </div>
          </div>

          {/* Category list */}
          <div className="space-y-2 mt-2">
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No categories yet.</p>
            ) : (
              categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{cat.name_en}</p>
                    {cat.name_bn && <p className="text-xs text-muted-foreground font-bangla">{cat.name_bn}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Switch checked={cat.is_active} onCheckedChange={() => handleCategoryToggle(cat)} />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openCategoryEdit(cat)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeletingCategory(cat)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirm */}
      <AlertDialog open={!!deletingCategory} onOpenChange={(open) => !open && setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete "{deletingCategory?.name_en}"? Projects using this category won't be affected.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCategoryDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminPortfolio;
