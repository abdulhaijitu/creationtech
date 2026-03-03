import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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

const emptyFormData = {
  slug: '',
  title_en: '',
  title_bn: '',
  client_en: '',
  client_bn: '',
  description_en: '',
  description_bn: '',
  category: '',
  tags: '',
  result_en: '',
  result_bn: '',
  image_url: '',
  is_featured: false,
  is_active: true,
};

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

const AdminPortfolio = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(emptyFormData);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

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

  useEffect(() => { fetchProjects(); }, []);

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
      title_bn: project.title_bn || '',
      client_en: project.client_en || '',
      client_bn: project.client_bn || '',
      description_en: project.description_en || '',
      description_bn: project.description_bn || '',
      category: project.category || '',
      tags: project.tags.join(', '),
      result_en: project.result_en || '',
      result_bn: project.result_bn || '',
      image_url: project.image_url || '',
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
        title_bn: formData.title_bn || null,
        client_en: formData.client_en || null,
        client_bn: formData.client_bn || null,
        description_en: formData.description_en || null,
        description_bn: formData.description_bn || null,
        category: formData.category || null,
        tags: tagsArray,
        result_en: formData.result_en || null,
        result_bn: formData.result_bn || null,
        image_url: formData.image_url || null,
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
                  <Label>Title (Bangla)</Label>
                  <Input value={formData.title_bn} onChange={(e) => setFormData({ ...formData, title_bn: e.target.value })} className="font-bangla" placeholder="প্রজেক্ট টাইটেল" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Slug <span className="text-destructive">*</span></Label>
                  <Input value={formData.slug} onChange={(e) => { setSlugManuallyEdited(true); setFormData({ ...formData, slug: e.target.value }); }} placeholder="auto-generated-from-title" className="font-mono text-xs" />
                  <p className="text-[11px] text-muted-foreground mt-1">Auto-generated from title. Edit to customize.</p>
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Web App, Mobile" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Client & Description */}
          <Card>
            <CardHeader><CardTitle>Client & Description</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Client (English)</Label>
                  <Input value={formData.client_en} onChange={(e) => setFormData({ ...formData, client_en: e.target.value })} />
                </div>
                <div>
                  <Label>Client (Bangla)</Label>
                  <Input value={formData.client_bn} onChange={(e) => setFormData({ ...formData, client_bn: e.target.value })} className="font-bangla" />
                </div>
              </div>
              <div>
                <Label>Description (English)</Label>
                <Textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={4} />
              </div>
              <div>
                <Label>Description (Bangla)</Label>
                <Textarea value={formData.description_bn} onChange={(e) => setFormData({ ...formData, description_bn: e.target.value })} rows={4} className="font-bangla" />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Tags & Results */}
          <Card>
            <CardHeader><CardTitle>Tags & Results</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tags (comma separated)</Label>
                <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="React, Node.js, AWS" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Result (English)</Label>
                  <Input value={formData.result_en} onChange={(e) => setFormData({ ...formData, result_en: e.target.value })} placeholder="200% increase in sales" />
                </div>
                <div>
                  <Label>Result (Bangla)</Label>
                  <Input value={formData.result_bn} onChange={(e) => setFormData({ ...formData, result_bn: e.target.value })} placeholder="বিক্রয়ে ২০০% বৃদ্ধি" className="font-bangla" />
                </div>
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
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
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
};

export default AdminPortfolio;
